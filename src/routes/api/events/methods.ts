import { fetchFromClient } from '../../../helpers/fetch';
import type { Event } from '$lib/types/event';

export const getEventsListMethod = async () => {
	try {
		const response = await fetchFromClient('GET', `/api/events`);
		const json = await response.json();

		return json;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const createEventMethod = async (data: Event) => {
	// !TODO
	// validateOrThrow(eventCreateFormScheme, body)

	try {
		const response = await fetchFromClient('POST', '/api/events', data);

		return await response.json();
	} catch (error) {
		console.error(error);

		throw error;
	}
};
