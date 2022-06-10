// Dependencies
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export default function WorldClock(startTime: Date) {
	const [date, setDate] = useState(startTime);

	useEffect(() => {
		// set interval to update time
		const updateInterval = setInterval(() => setDate(new Date()), 1000);

		// clear interval on unmount
		return () => clearInterval(updateInterval);
	}, [date]);

	return (
		<View>
			<Text>{dayjs(date).format('HH:mm')}</Text>
		</View>
	);
}
