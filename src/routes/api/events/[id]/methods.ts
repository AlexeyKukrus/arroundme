import { fetchFromClient } from '../../../../helpers/fetch';
import type { Event } from '$lib/types/event';
// import { validateOrThrow } from '../../../../helpers/validation-helpers';

export const getEventByIdMethod = async (id: string): Promise<Event> => {
	const response = await fetchFromClient('GET', `/api/events/${id}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch event: ${response.status}`);
	}

	return (await response.json()) as Event;
};

export const updateEventByIdMethod = async (data: Event) => {
	const { id, ...body } = data;
	// !TODO
	// validateOrThrow(eventUpdateFormScheme, body)
	delete data.id;

	try {
		const response = await fetchFromClient('PUT', `/api/events/${id}`, body);
		return await response.json();
	} catch (error) {
		console.error(error);

		throw error;
	}
};

export const deleteEventByIdMethod = async (id) => {
	try {
		const response = await fetchFromClient(
			"DELETE",
			`/api/events/${id}`
		)
		return await response.json()
	} catch (error) {
		console.error(error)
		throw error
	}
}
