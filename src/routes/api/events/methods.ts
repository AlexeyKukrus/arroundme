import { fetchFromClient } from '../../../helpers/fetch';

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

export const getEventByIdMethod = async (id: string): Promise<Event> => {
    const response = await fetchFromClient("GET", `events/${id}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch event: ${response.status}`);
    }

    return await response.json() as Event;
};