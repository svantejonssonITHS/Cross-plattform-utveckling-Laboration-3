// Dependencies
import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';
import dayjs from 'dayjs';

export default function WorldClock(props: { startTime: Date; offset: string; city: string }) {
	const [date, setDate] = useState(props.startTime);
	useEffect(() => {
		// set interval to update time
		const updateInterval = setInterval(() => setDate(new Date()), 1000);

		// clear interval on unmount
		return () => clearInterval(updateInterval);
	}, [date]);

	return (
		<Card>
			<Card.Content style={{ flexDirection: 'row', alignContent: 'center' }}>
				<View style={{ flex: 1 }}>
					<Paragraph>{props.offset + ' GMT'}</Paragraph>
					<Title>{props.city}</Title>
				</View>
				<Title style={{ alignSelf: 'center' }}>{dayjs(date).format('HH:mm')}</Title>
			</Card.Content>
		</Card>
	);
}
