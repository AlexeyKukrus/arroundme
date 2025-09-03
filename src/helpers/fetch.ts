import { HttpError } from '../models/http-error-model';
import { ENV_CONFIG } from '../lib/config/environment';

type FetchConfig = {
	method: string;
	headers: Record<string, string>;
	body?: BodyInit;
};

type ServerFetchParams = {
	cookies: {
		get: (key: string) => string | undefined;
	};
	fetch: typeof fetch;
	request: Request;
};

// Для отправки запроса с клиентской части на серверную внутри приложения.
export const fetchFromClient = async (
	method: string,
	url: string,
	data?: unknown | FormData
): Promise<Response> => {
	const config: FetchConfig = {
		method,
		headers: {}
	};

	if (data instanceof FormData) {
		config.body = data;
	} else if (data) {
		config.headers['Content-Type'] = 'application/json';
		config.body = JSON.stringify(data);
	}

	const response = await fetch(url, config);

	if (!response.ok) {
		let errorMessage = `Ошибка ответа сервера: ${response.status}`;
		try {
			const errorBody = await response.clone().json();
			if (Array.isArray(errorBody)) {
				const formattedMessages = errorBody
					.map(
						(err: { name?: string; message?: string }, index: number) =>
							`${index + 1}. ${err.name}: ${err.message}`
					)
					.join('\n');
				errorMessage += `\n${formattedMessages}\n`;
			} else if (errorBody?.message) {
				errorMessage += ` – ${errorBody.name}: ${errorBody.message}\n`;
			}
		} catch (e) {
			// Игнорируем, если тело не JSON
		}

		throw new HttpError(response.status, errorMessage);
	}
	return response;
};

// Для отправки запроса с серверной части на API. Вызывается в +server.js файлах
export async function fetchFromServer(url: string, params: ServerFetchParams): Promise<Response> {
	const { cookies, fetch, request } = params;

	const config: FetchConfig = {
		method: request.method,
		headers: { authorization: 'Bearer ' + cookies.get('accessToken') }
	};

	if (request.headers.get('content-type')?.includes('multipart/form-data')) {
		config.body = await request.formData();
	} else if (request.body) {
		config.body = JSON.stringify(await request.json());
	}

	return await fetch(`${ENV_CONFIG.apiBaseUrl}/${url}`, config);
}

export async function fetchFromGeocode(url: string, params: ServerFetchParams): Promise<Response> {
	const { cookies, fetch, request } = params;

	const config: FetchConfig = {
		method: request.method,
		headers: { authorization: 'Bearer ' + cookies.get('accessToken') }
	};

	if (request.headers.get('content-type')?.includes('multipart/form-data')) {
		config.body = await request.formData();
	} else if (request.body) {
		config.body = JSON.stringify(await request.json());
	}

	return await fetch(`${ENV_CONFIG.geocodeBaseUrl}/${url}`, config);
}

export const fetchFromAuth = async (
	method: string,
	url: string,
	data: Record<string, string>
): Promise<Response> => {
	const config: FetchConfig = {
		method,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;'
		},
		body: new URLSearchParams(data)
	};

	return await fetch(url, config);
};
