// External dependencies
import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';

// Internal dependencies
import { getTime, getStyles } from '../misc';

export default function WorldClock(props: { startTime: string; timezone: string; offset: number; city: string }) {
	const [time, setTime] = useState(props.startTime);
	const [styles] = useState(getStyles('light'));

	useEffect(() => {
		// set interval to update time
		const updateInterval = setInterval(() => setTime(getTime(props.offset) as string), 1000);

		// clear interval on unmount
		return () => clearInterval(updateInterval);
	}, [time]);

	return (
		<Card>
			<Card.Content style={styles.clockContainer}>
				<View style={styles.clockInfo}>
					<Paragraph>{props.timezone}</Paragraph>
					<Title>{props.city}</Title>
				</View>
				<Title style={styles.clockTime}>{time}</Title>
			</Card.Content>
		</Card>
	);
}
