// External dependencies
import { View, Text, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';

// Internal dependencies
import { getStyles, formatStopwatch } from '../misc';
import { store } from '../Store';

export default function Stopwatch() {
	const [styles, setStyles] = useState(getStyles(store.getState().theme) as any);
	const [theme] = useSelector((state: any) => [state.theme]);
	const [paused, setPaused] = useState(true);
	const [time, setTime] = useState(0);
	const [laps, setLaps] = useState([] as number[]);
	const [stopwatchInterval, setStopwatchInterval] = useState(null as any);
	let startTime = 0;

	function start() {
		if (!stopwatchInterval) {
			setStopwatchInterval(
				setInterval(() => {
					if (!startTime) {
						startTime = Date.now();
					}
					setTime(time + (Date.now() - startTime));
				}, 50)
			);
		}
	}

	function pause() {
		if (stopwatchInterval) {
			clearInterval(stopwatchInterval);
			setStopwatchInterval(null);
		}
		startTime = 0;
	}

	function reset() {
		pause();
		setTime(0);
	}

	function lap() {
		if (stopwatchInterval) {
			if (laps.length === 0) {
				setLaps([time]);
			} else {
				// Add the current time to the list of laps relative to the last lap
				setLaps([...laps, time - laps[laps.length - 1]]);
			}
		}
	}

	useEffect(() => {
		setStyles(getStyles(theme));
	}, [theme]);

	return (
		<View style={styles.body}>
			<Appbar.Header style={styles.header}>
				<Appbar.Content title="Stopwatch" titleStyle={styles.header.title} />
			</Appbar.Header>
			<Button
				title="Start/Pause"
				onPress={() => {
					setPaused(!paused);
					if (paused) {
						start();
					} else {
						pause();
					}
				}}
			/>
			<Button
				title="Lap"
				onPress={() => {
					lap();
				}}
			/>
			<Text style={{ color: styles.textHighEmphasis }}>{formatStopwatch(time)}</Text>
			{laps &&
				laps.map((lap, index) => (
					<Text key={index} style={{ color: styles.textHighEmphasis }}>
						{formatStopwatch(lap)}
					</Text>
				))}
		</View>
	);
}
