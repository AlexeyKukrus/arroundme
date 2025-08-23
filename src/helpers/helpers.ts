export const truncateString = (str: string, maxLength: number): string => {
	if (!str || str.length <= maxLength) return str;

	const ellipsis = '...';
	const ellipsisLength = ellipsis.length;
	const actualMaxLength = maxLength > ellipsisLength ? maxLength - ellipsisLength : 1;

	let truncated = str.slice(0, actualMaxLength + 1);
	const lastSpaceIndex = truncated.lastIndexOf(' ');

	if (lastSpaceIndex > 0) {
		truncated = truncated.slice(0, lastSpaceIndex);
	} else {
		truncated = truncated.slice(0, actualMaxLength);
	}

	return truncated + ellipsis;
};

export const formatISOtoString = (isoString: string): string => {
	return isoString.slice(0, 16);
};

export const formatStringToISOString = (dateString: string): string => {
	const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
	if (!regex.test(dateString)) {
		throw new Error(`Invalid date format. Expected "YYYY-MM-DDTHH:mm", got "${dateString}"`);
	}

	return `${dateString}:00Z`;
};

export const isValidDateHelper = (aValue) => {
	const regFullIso = new RegExp(
		"^[0-9]+-[0-9]+-[0-9]+T[0-9]+:[0-9]+:[0-9]+\\.[0-9]+Z$"
	)
	let isValid = false

	if (aValue) {
		if (aValue instanceof Date && !isNaN(aValue)) {
			isValid = true
		}
		if (regFullIso.test(aValue)) {
			isValid = true
		}
	}

	return isValid
}