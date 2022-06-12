// External dependencies
import { StyleSheet } from 'react-native';

// Internal ependencies
import { ITimezone } from '../interfaces/';

export async function getTimezones() {
	const request = await fetch('http://worldtimeapi.org/api/timezone');
	let timezones = await request.json();

	// Remove all timezones that are not in the format of "Continent/City"
	timezones = timezones.filter((timezone: string) => timezone.includes('/') && !timezone.includes('Etc'));

	// Replace any underscores with spaces and return the timezones
	return timezones.map((timezone: string) => timezone);
}

export async function getDetailedTimezone(timezone: string) {
	const request = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
	const detailedTimezone = await request.json();

	// Create an object with the timezone interface
	const timezoneObject: ITimezone = {
		name_api: detailedTimezone.timezone,
		name_human: detailedTimezone.timezone.replace(/_/g, ' '),
		city: detailedTimezone.timezone
			.split(/\//g)
			[detailedTimezone.timezone.split(/\//g).length - 1].replace(/_/g, ' '),
		offset: getOffset(detailedTimezone.utc_offset),
		offset_str: detailedTimezone.utc_offset + ' GMT'
	};

	return timezoneObject;
}

export function getTime(offset: number) {
	if (!offset) return '00:00';

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
	if (!offset) return 0;

	const preparedOffset = offset.split(/(\+|-)/g)[2].split(':');
	const parsedOffset = parseInt(preparedOffset[0]) + parseInt(preparedOffset[1]) / 60;

	if (offset.split(/(\+|-)/g)[1] === '-') return parsedOffset * -1;
	return parsedOffset;
}

export function stringMatch(string: string, otherString: string) {
	return string.toLowerCase().replace(/_/g, ' ').includes(otherString.toLowerCase().replace(/_/g, ' '));
}

export function getStyles(theme: 'light' | 'dark') {
	/* NOTE
	Footer styling is set in Router.tsx 
	Any button styling should be set in the component that uses it
	*/

	const bgPrimary = theme === 'light' ? '#0073e6' : '#fff';
	const bgSecondary = theme === 'light' ? '#e6f3ff' : '#000';
	const textPrimary = theme === 'light' ? '#fff' : '#000';
	const textSecondary = theme === 'light' ? '#ff7d2d' : '#fff';

	return StyleSheet.create({
		body: {
			color: textPrimary,
			backgroundColor: bgSecondary,
			height: '100%'
		},
		header: {
			color: textPrimary,
			backgroundColor: bgPrimary
		},
		headerTitle: {
			alignSelf: 'center'
		},
		modal: {
			backgroundColor: bgSecondary,
			height: '95%',
			width: '100%',
			alignItems: 'center',
			position: 'absolute',
			bottom: 0,
			borderTopStartRadius: 10,
			borderTopEndRadius: 10
		},
		searchContainer: {
			width: '100%',
			padding: 10,
			flexDirection: 'row'
		},
		searchInput: {
			backgroundColor: '#b5dbff',
			padding: 5,
			borderRadius: 10,
			flex: 1,
			marginRight: 10
		},
		scrollContainer: {
			width: '100%'
		},
		clockContainer: {
			flexDirection: 'row',
			alignContent: 'center'
		},
		clockInfo: {
			flex: 1
		},
		clockTime: {
			alignSelf: 'center'
		}
	});
}
