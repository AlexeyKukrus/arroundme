import { json } from '@sveltejs/kit';
import { processApiResponse } from '../../../../helpers/api-response-helpers';
import { fetchFromServer } from '../../../../helpers/fetch';

export async function GET({ url, cookies, fetch, request }) {
	const response = await fetchFromServer(`events/categories`, {
		cookies,
		fetch,
		request
	});

	const jsonData = await processApiResponse(response);

	return json(jsonData);
}
