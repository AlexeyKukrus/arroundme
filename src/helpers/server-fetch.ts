import { PRIVATE_API_BASE_URL, PRIVATE_GEOCODE_BASE_URL } from '$env/static/private';

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

	return await fetch(`${PRIVATE_API_BASE_URL}/${url}`, config);
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

	return await fetch(`${PRIVATE_GEOCODE_BASE_URL}/${url}`, config);
}
