import { fetchFromGeocode, fetchFromServer } from '../../../helpers/fetch';
import { processApiResponse } from '../../../helpers/api-response-helpers';
import { json } from '@sveltejs/kit';

export async function GET({ url, cookies, fetch, request }) {
	const paramsString = url.search;
	const response = await fetchFromGeocode(`${paramsString}`, {
		cookies,
		fetch,
		request
	});

	const jsonData = await processApiResponse(response);

	return json(jsonData);
}
