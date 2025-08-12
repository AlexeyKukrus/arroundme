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
