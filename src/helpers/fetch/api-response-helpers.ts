import { error } from '@sveltejs/kit';
import { HttpError } from '@app/models/http-error-model';
import { isValidDateHelper } from '@helpers/helpers';

type ErrorDetail = {
	label?: string;
	field?: string;
	loc?: string | string[];
	name?: string | string[];
	reason?: string;
	type?: string;
	message?: string;
	msg?: string;
};

type MappedError = {
	name: string;
	type: string;
	message: string;
};

type ApiResponse = Response & {
	requestOptions?: {
		method?: string;
		body?: any;
	};
	time?: number;
};

type AliasData = {
	error_backend_alias?: {
		http_status_code: number;
		http_body: string | object;
	};
	details?: ErrorDetail[];
	detail?: ErrorDetail | ErrorDetail[];
	[key: string]: any;
};

function toCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function fixFieldName(name: string | string[]): string {
	if (Array.isArray(name)) return name.join('.');
	return name;
}

function getJsonString(value: string | object): object {
	try {
		return typeof value === 'string' ? JSON.parse(value) : value;
	} catch {
		return {};
	}
}

function logTerminal(messageA: string = '', messageB: string = ''): void {
	console.log(messageA, messageB);
}

function getColor(status: number): 'green' | 'yellow' | 'red' {
	if (status === 200) return 'green';
	if (status === 400) return 'yellow';
	return 'red';
}

export const processApiResponse = async (response: ApiResponse): Promise<any> => {
	const status = response.status;
	const statusText = response.statusText;
	const method = response.requestOptions?.method?.toUpperCase?.() || 'GET';
	const url = response.url;
	const time = response.time || '?';
	const body = response.requestOptions?.body;
	const contentType = response.headers.get('content-type') || '';
	const isJson = contentType.includes('application/json');

    const responseText = `${status} ${statusText} | ${time}ms | ${method} ${url}`;
    console.log(responseText);

	if (['POST', 'PUT', 'PATCH'].includes(method)) {
		logTerminal('Request body:', body);
	}

	let jsonData: AliasData | null = null;
	if (isJson) {
		try {
			jsonData = await response.clone().json();
		} catch (e) {
			// fallback to text logging
		}
	}

	const alias = jsonData?.error_backend_alias;
	const aliasStatus = alias?.http_status_code;
	const aliasJson = getJsonString(alias?.http_body || {});

	if (alias) {
		const requestId = aliasJson?.['request-id'] ?? aliasJson?.data?.['request-id'] ?? null;

		const message = requestId
			? `${aliasStatus} ${statusText} requestId: ${requestId}`
			: `${aliasStatus} ${statusText}`;

		if ([400, 403, 404, 409, 422].includes(aliasStatus)) {
			logTerminal('Response body:', JSON.stringify(jsonData));

			const details = aliasJson.details ?? aliasJson.detail;
			if (Array.isArray(details)) {
				const mapped = details.map((each: ErrorDetail) => {
					const rawName = each.label || each.field || each.loc || each.name || '';
					const name = fixFieldName(rawName);
					const type = each.reason || each.type?.split('.')?.map(toCamelCase)?.join('.') || '';
					const message = each.message || each.msg || '';

					return { name, type, message };
				});

				// Обработка ошибок валидации, возвращаемых сервером
				throw error(aliasStatus, mapped);
			}

			throw new HttpError(aliasStatus, message);
		}

		if (aliasStatus === 401) {
			// TODO: Обработка логаута (если есть реализация)
		}

		if (aliasStatus > 400) {
			throw new HttpError(aliasStatus, message);
		}

		return jsonData;
	}

	if (!response.ok) {
		if ([400, 422].includes(status)) {
			logTerminal('Response body:', JSON.stringify(jsonData));

			const details = jsonData?.details ?? jsonData?.detail;
			if (Array.isArray(details)) {
				const mapped = details.map((each: ErrorDetail) => {
					const message = each.message || each.msg || '';
					let name = each.name || each.field || '';
					let type = each.type || each.reason || '';

					if (typeof name === 'string' && name.includes('.')) {
						name = name.slice(name.indexOf('.') + 1);
					}
					if (typeof type === 'string' && type.includes('.')) {
						type = type.slice(type.indexOf('.') + 1);
					}

					return { name, type, message };
				});

				// Обработка ошибок валидации, возвращаемых сервером
				throw error(status, mapped);
			}

			throw new HttpError(status, `${status} ${statusText}`);
		}

		if (status === 401) {
			// TODO: Обработка логаута (если есть реализация)
		}

		throw new HttpError(status, `${status} ${statusText}`);
	}

	return isJson ? jsonData : response;
};

export const getQueryParamsString = (aParams) => {
	const paramsArray = [];
	let paramsString = '';
	const checkParam = (aValue) => {
		let isValid = false;

		if (!!aValue) {
			if (aValue instanceof Date) {
				if (!isNaN(aValue)) {
					isValid = true;
				}
			} else {
				isValid = true;
			}
		}
		if (typeof aValue === 'boolean') {
			isValid = true;
		}
		if (typeof aValue === 'number') {
			isValid = true;
		}

		return isValid;
	};

	const addParamsArray = (aKey, aValue) => {
		const isValidDate = isValidDateHelper(aValue);
		let validValue;

		if (isValidDate) {
			validValue = new Date(aValue).toISOString();
		} else {
			validValue = aValue;
		}

		const paramString = `${aKey}=${validValue}`;
		paramsArray.push(paramString);
	};

	if (aParams && typeof aParams === 'object') {
		for (let param in aParams) {
			const item = aParams[param];

			if (checkParam(item)) {
				if (Array.isArray(item)) {
					item.forEach((value) => {
						if (checkParam(value)) {
							addParamsArray(param, value);
						}
					});
				} else {
					addParamsArray(param, item);
				}
			}
		}

		paramsString = paramsArray.join('&');
		paramsString = !!paramsString ? `?${paramsString}` : '';
	}

	return paramsString;
};
