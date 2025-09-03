import { fetchFromClient } from '../../../helpers/fetch';
import { getQueryParamsString } from '../../../helpers/api-response-helpers';

export const getAddressByCoordsMethod = async (data) => {
	try {
		const paramsString = getQueryParamsString(data);
		const response = await fetchFromClient('GET', `/api/geocode/${paramsString}`);
		const json = await response.json();

		return json.response.GeoObjectCollection;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
