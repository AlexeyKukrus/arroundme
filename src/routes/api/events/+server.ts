
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { fetchFromServer } from '@helpers/fetch/server-fetch';
import { processApiResponse } from '@helpers/fetch/api-response-helpers';

export async function GET({ url, cookies, fetch, request }: RequestEvent) {
	const response = await fetchFromServer(`events`, {
		cookies,
		fetch,
		request
	});

	const jsonData = await processApiResponse(response);

	return json(jsonData);
}

export async function POST({ cookies, fetch, request }: RequestEvent) {
	const response = await fetchFromServer('events', {
		cookies,
		fetch,
		request
	});
	const jsonData = await processApiResponse(response);
	return json(jsonData);
}
