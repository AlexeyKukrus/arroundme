import { fetchFromClient } from '@helpers/fetch/fetch';
import { getQueryParamsString, processApiResponse } from '@helpers/fetch/api-response-helpers';

export const getAddressByCoordsMethod = async (data: Record<string, any>) => {
	try {
		const paramsString = getQueryParamsString(data);
		const response = await fetchFromClient('GET', `/api/geocode/${paramsString}`);
		const json = await processApiResponse(response);
		return json.response.GeoObjectCollection;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
