import { fetchFromClient } from '@helpers/fetch/fetch';
import { processApiResponse } from '@helpers/fetch/api-response-helpers';
import { notifications } from '@shared/stores/notifications/store';
import type { Event } from '@app/models/events/types';

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface EventsListResponse extends ApiResponse {
	events: Event[];
}

export const getEventsListMethod = async (): Promise<EventsListResponse> => {
	try {
    const response = await fetchFromClient('GET', `/api/events`);
    const json = await processApiResponse(response);

		notifications.success(
			'События загружены',
			`Успешно загружено ${json.events?.length || 0} событий`
		);

		return json;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';

		notifications.error('Ошибка загрузки', `Не удалось загрузить список событий: ${errorMessage}`);

		throw error;
	}
};

export const createEventMethod = async (data: Event): Promise<ApiResponse<Event>> => {
	// !TODO
	// validateOrThrow(eventCreateFormScheme, body)

	try {
    const response = await fetchFromClient('POST', '/api/events', data);
    const result = await processApiResponse(response);

		notifications.success('Событие создано', `Событие "${data.name}" успешно создано`);

		return result;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';

		notifications.error('Ошибка создания', `Не удалось создать событие: ${errorMessage}`);

		throw error;
	}
};

export const updateEventMethod = async (
	id: string,
	data: Partial<Event>
): Promise<ApiResponse<Event>> => {
	try {
    const response = await fetchFromClient('PUT', `/api/events/${id}`, data);
    const result = await processApiResponse(response);

		notifications.success(
			'Событие обновлено',
			`Событие "${data.name || 'Без названия'}" успешно обновлено`
		);

		return result;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';

		notifications.error('Ошибка обновления', `Не удалось обновить событие: ${errorMessage}`);

		throw error;
	}
};

export const deleteEventMethod = async (id: string): Promise<ApiResponse<void>> => {
	try {
    const response = await fetchFromClient('DELETE', `/api/events/${id}`);
    const result = await processApiResponse(response);

		notifications.success('Событие удалено', 'Событие успешно удалено');

		return result;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';

		notifications.error('Ошибка удаления', `Не удалось удалить событие: ${errorMessage}`);

		throw error;
	}
};
