import { fetchFromServer } from '../../../../helpers/fetch';
import { processApiResponse } from '../../../../helpers/api-response-helpers';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async (params) => {
	const id = params.params.id;
	const { cookies, fetch, request } = params;

	const response = await fetchFromServer(`events/${id}`, {
		cookies,
		fetch,
		request
	});

	const jsonData = await processApiResponse(response);

	return json(jsonData);
};

export const PUT = async (params) => {
	const id = params.params.id;
	const { cookies, fetch, request } = params;
	const response = await fetchFromServer(`events/${id}`, {
		cookies,
		fetch,
		request
	});
	console.log(params);

	const jsonData = await processApiResponse(response);

	return json(jsonData);
};
