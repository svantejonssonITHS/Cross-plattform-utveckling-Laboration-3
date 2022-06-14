// Dependencies
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
	if (!offset && isNaN(offset)) return '00:00';

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
	/*
	const bgPrimary = theme === 'light' ? '#0073e6' : '#121212';
	const bgSecondary = theme === 'light' ? '#e6f3ff' : '#121212';
	const bgTertiary = theme === 'light' ? '#fff' : '#1e1e1e';
	const textPrimary = theme === 'light' ? '#fff' : '#000';
	const textSecondary = theme === 'light' ? '#ff7d2d' : '#fff';
	const textTertiary = theme === 'light' ? '#000' : '#fff';

	const textHighEmphasis = theme === 'light' ? '#000' : '#e1e1e1';
	const textMediumEmphasis = theme === 'light' ? '#3f3f3f' : '#b2b2b2';*/

	const colorPrimary = theme === 'light' ? '#0073e6' : '#121212';
	const colorSecondary = theme === 'light' ? '#e6f3ff' : '#121212';
	const colorTertiary = theme === 'light' ? '#cde7ff' : '#1e1e1e';
	const colorAccent = '#ff7d2d';
	const colorNeutral = theme === 'light' ? '#fff' : '#1e1e1e';

	const textHighEmphasis = theme === 'light' ? '#000' : '#e1e1e1';
	const textMediumEmphasis = theme === 'light' ? '#3f3f3f' : '#b2b2b2';
	const textLowEmphasis = theme === 'light' ? '#b2b2b2' : '#3f3f3f';
	const textAccent = '#ff7d2d';

	return {
		colorPrimary,
		colorSecondary,
		colorAccent,
		colorNeutral,
		textHighEmphasis,
		textMediumEmphasis,
		textLowEmphasis,
		textAccent,
		body: {
			color: textHighEmphasis,
			backgroundColor: colorSecondary,
			height: '100%'
		},
		header: {
			backgroundColor: colorPrimary,
			color: textHighEmphasis,
			title: {
				alignSelf: 'center'
			}
		},
		modal: {
			backgroundColor: colorSecondary,
			height: '95%',
			width: '100%',
			alignItems: 'center',
			position: 'absolute',
			bottom: 0,
			borderTopStartRadius: 10,
			borderTopEndRadius: 10
		},
		search: {
			container: {
				width: '100%',
				padding: 10,
				flexDirection: 'row'
			},
			input: {
				backgroundColor: colorTertiary,
				color: textHighEmphasis,
				padding: 5,
				borderRadius: 10,
				flex: 1,
				marginRight: 10
			},
			button: {
				color: colorAccent,
				backgroundColor: colorNeutral
			}
		},
		card: {
			backgroundColor: colorNeutral,
			content: {
				flexDirection: 'row',
				alignContent: 'center',
				info: {
					flex: 1
				},
				time: {
					alignSelf: 'center',
					color: textHighEmphasis
				}
			}
		},
		settings: {
			height: '100%',
			backgroundColor: theme === 'light' ? colorNeutral : colorSecondary,
			title: {
				color: textHighEmphasis,
				fontSize: 30,
				fontWeight: 'bold',
				padding: 10
			},
			radio: {
				activeColor: theme === 'light' ? colorPrimary : colorAccent,
				inactiveColor: theme === 'light' ? colorPrimary : colorAccent,
				textColor: textHighEmphasis,
				circleSize: 20
			}
		},
		scroll: {
			width: '100%'
		}
	};
}
