// External dependencies
import { View } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';

// Internal dependencies
import { getTime, getStyles } from '../misc';
import { ThemeContext } from '../contexts';

export default function WorldClock(props: { startTime: string; timezone: string; offset: number; city: string }) {
	const [time, setTime] = useState(props.startTime);
	const [theme] = useState(useContext(ThemeContext).theme);
	const [styles, setStyles] = useState(getStyles(useContext(ThemeContext).theme));

	useEffect(() => {
		setStyles(getStyles(theme));

		// set interval to update time
		const updateInterval = setInterval(() => setTime(getTime(props.offset) as string), 1000);

		// clear interval on unmount
		return () => clearInterval(updateInterval);
	}, [time, theme]);

	return (
		<Card style={styles.background}>
			<Card.Content style={styles.clockContainer}>
				<View style={styles.clockInfo}>
					<Paragraph style={styles.text}>{props.timezone}</Paragraph>
					<Title style={styles.text}>{props.city}</Title>
				</View>
				<Title style={styles.clockTime}>{time}</Title>
			</Card.Content>
		</Card>
	);
}
