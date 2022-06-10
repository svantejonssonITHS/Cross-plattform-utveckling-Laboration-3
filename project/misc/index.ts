export async function getTimezones() {
	const request = await fetch('http://worldtimeapi.org/api/timezone');
	const timezones = await request.json();

	// Remove all timezones that are not in the format of "Continent/City"
	return timezones.filter((timezone: string) => timezone.includes('/') && !timezone.includes('Etc'));
}

export async function getDetailedTimezone(timezone: string) {
	const request = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
	return await request.json();
}
