import { HttpError } from '../models/http-error-model';

type FetchConfig = {
	method: string;
	headers: Record<string, string>;
	body?: BodyInit;
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
		config.body = data as BodyInit;
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
