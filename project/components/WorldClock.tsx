// External dependencies
import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

// Internal dependencies
import { getTime, getStyles } from '../misc';
import { store } from '../Store';

export default function WorldClock(props: {
	startTime: string;
	timezone: string;
	offset: number;
	city: string;
	onDelete(): void;
	showDelete: boolean;
}) {
	const [time, setTime] = useState(props.startTime);
	const [theme] = useSelector((state: any) => [state.theme]);
	const [styles, setStyles] = useState(getStyles(store.getState().theme) as any);

	useEffect(() => {
		setStyles(getStyles(theme));

		// set interval to update time
		const updateInterval = setInterval(() => setTime(getTime(props.offset) as string), 1000);

		// clear interval on unmount
		return () => clearInterval(updateInterval);
	}, [time, theme]);

	return (
		<Card style={styles.card}>
			<Card.Content style={styles.card.content}>
				{props.showDelete && (
					<Card.Actions style={styles.card.content.action}>
						<Button
							icon="delete"
							color={styles.card.content.action.button.color}
							onPress={() => props.onDelete(props.city)}
						/>
					</Card.Actions>
				)}
				<View style={styles.card.content.info}>
					<Paragraph style={{ color: styles.textMediumEmphasis }}>{props.timezone}</Paragraph>
					<Title style={{ color: styles.textHighEmphasis }}>{props.city}</Title>
				</View>
				<Title style={styles.card.content.time}>{time}</Title>
			</Card.Content>
		</Card>
	);
}
