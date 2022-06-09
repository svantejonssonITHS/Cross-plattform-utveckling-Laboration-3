async function request(request: string): Promise<unknown> {
	const response = await fetch(request);
	return await response.json();
}

export async function getTimezones() {
	const timezones = await request('http://worldtimeapi.org/api/timezone');
	// Remove all timezones that are not in the format of "Continent/City"
	return timezones.filter((timezone: string) => timezone.includes('/') && !timezone.includes('Etc'));
}
