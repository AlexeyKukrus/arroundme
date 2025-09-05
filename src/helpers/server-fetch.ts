import { env } from '$env/dynamic/private';

const API_BASE_URL = env.PRIVATE_API_BASE_URL || '';
const GEOCODE_BASE_URL = env.PRIVATE_GEOCODE_BASE_URL || '';

type FetchConfig = {
	method: string;
	headers: Record<string, string>;
	body?: BodyInit;
};

export type ServerFetchParams = {
	cookies: {
		get: (key: string) => string | undefined;
	};
	fetch: typeof fetch;
	request: Request;
};

export async function fetchFromServer(url: string, params: ServerFetchParams): Promise<Response> {
	const { cookies, fetch, request } = params;

	const config: FetchConfig = {
		method: request.method,
		headers: { authorization: 'Bearer ' + (cookies.get('accessToken') || '') }
	};

	if (request.headers.get('content-type')?.includes('multipart/form-data')) {
		config.body = (await request.formData()) as unknown as BodyInit;
	} else if (request.body) {
		// В SvelteKit Request.body может быть использован один раз
		try {
			const json = await request.clone().json();
			config.body = JSON.stringify(json);
		} catch {
			// игнорируем, если тело нельзя прочитать как JSON
		}
	}

	if (!API_BASE_URL) {
		throw new Error('PRIVATE_API_BASE_URL is not set');
	}
	return await fetch(`${API_BASE_URL}/${url}`, config);
}

export async function fetchFromGeocode(url: string, params: ServerFetchParams): Promise<Response> {
	const { cookies, fetch, request } = params;

	const config: FetchConfig = {
		method: request.method,
		headers: { authorization: 'Bearer ' + (cookies.get('accessToken') || '') }
	};

	if (request.headers.get('content-type')?.includes('multipart/form-data')) {
		config.body = (await request.formData()) as unknown as BodyInit;
	} else if (request.body) {
		try {
			const json = await request.clone().json();
			config.body = JSON.stringify(json);
		} catch {
			// игнорируем
		}
	}

	if (!GEOCODE_BASE_URL) {
		throw new Error('PRIVATE_GEOCODE_BASE_URL is not set');
	}
	return await fetch(`${GEOCODE_BASE_URL}/${url}`, config);
}
