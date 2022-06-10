export async function getTimezones() {
	const request = await fetch('http://worldtimeapi.org/api/timezone');
	let timezones = await request.json();

	// Remove all timezones that are not in the format of "Continent/City"
	timezones = timezones.filter((timezone: string) => timezone.includes('/') && !timezone.includes('Etc'));

	// Replace any underscores with spaces and return the timezones
	return timezones.map((timezone: string) => timezone.replace(/_/g, ' '));
}

export async function getDetailedTimezone(timezone: string) {
	const request = await fetch(`http://worldtimeapi.org/api/timezone/${timezone.replace(/ /g, '_')}`);
	const detailedTimezone = await request.json();
	detailedTimezone.timezone = detailedTimezone.timezone.replace(/_/g, ' ');
	return detailedTimezone;
}

export function getTime(offset: number) {
	if (!offset) return null;

	// Clock offset to Greenwich Mean Time in hours
	const gmtOffset = 3600000 * offset;
	// Device offset to Greenwich Mean Time in hours
	const deviceOffset = new Date().getTimezoneOffset() / 60;

	// Return the time in the format of "HH:mm"
	return JSON.stringify(new Date(Date.now() + deviceOffset + gmtOffset))
		.split('T')[1]
		.split(':', 2)
		.join(':');
}

export function getOffset(offset: string) {
	if (!offset) return null;

	const preparedOffset = offset.split(/(\+|-)/g)[2].split(':');
	const parsedOffset = parseInt(preparedOffset[0]) + parseInt(preparedOffset[1]) / 60;

	if (offset.split(/(\+|-)/g)[1] === '-') return parsedOffset * -1;
	return parsedOffset;
}
