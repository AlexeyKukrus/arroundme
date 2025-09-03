import { fetchFromServer } from '../../../helpers/fetch';
import { processApiResponse } from '../../../helpers/api-response-helpers';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

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
