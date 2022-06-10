// External dependencies
import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';

// Internal dependencies
import { getTime, getOffset } from '../misc';

export default function WorldClock(props: { startTime: string; offset: string; city: string }) {
	const [time, setTime] = useState(props.startTime);

	useEffect(() => {
		// set interval to update time
		const updateInterval = setInterval(() => setTime(getTime(getOffset(props.offset) as number) as string), 1000);

		// clear interval on unmount
		return () => clearInterval(updateInterval);
	}, [time]);

	return (
		<Card>
			<Card.Content style={{ flexDirection: 'row', alignContent: 'center' }}>
				<View style={{ flex: 1 }}>
					<Paragraph>{props.offset + ' GMT'}</Paragraph>
					<Title>{props.city}</Title>
				</View>
				<Title style={{ alignSelf: 'center' }}>{time}</Title>
			</Card.Content>
		</Card>
	);
}
