import { fetchFromClient } from '@helpers/fetch/fetch';

export const getCategoriesListMethod = async () => {
	try {
		const response = await fetchFromClient('GET', `/api/events/categories`);
		const json = await response.json();

		return json;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
