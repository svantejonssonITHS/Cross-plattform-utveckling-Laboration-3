// External dependencies
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';

// Internal dependencies
import { getStyles, formatStopwatch } from '../misc';
import { store } from '../Store';

export default function Stopwatch() {
	const [styles, setStyles] = useState(getStyles(store.getState().theme) as any);
	const [theme] = useSelector((state: any) => [state.theme]);
	const [running, setRunning] = useState(false);
	const [time, setTime] = useState(0);
	const [laps, setLaps] = useState([] as number[]);
	const [bestLap, setBestLap] = useState(-1);
	const [worstLap, setWorstLap] = useState(-1);
	const [stopwatchInterval, setStopwatchInterval] = useState(null as any);
	let startTime = 0;

	function start() {
		setRunning(true);
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
		setRunning(false);
		if (stopwatchInterval) {
			clearInterval(stopwatchInterval);
			setStopwatchInterval(null);
		}
		startTime = 0;
	}

	function reset() {
		pause();
		setTime(0);
		setLaps([]);
	}

	function lap() {
		if (stopwatchInterval) {
			if (laps.length === 0) {
				setLaps([time]);
			} else {
				// Add the time difference between the last lap and the current time
				const newLaps = [...laps, time - laps[laps.length - 1]];

				// Save the best lap and the worst lap indexes
				let bestLapIndex = 0;
				let worstLapIndex = 0;
				for (let i = 0; i < newLaps.length; i++) {
					if (newLaps[i] < newLaps[bestLapIndex]) {
						bestLapIndex = i;
					}
					if (newLaps[i] > newLaps[worstLapIndex]) {
						worstLapIndex = i;
					}
				}

				setBestLap(bestLapIndex);
				setWorstLap(worstLapIndex);
				setLaps(newLaps);
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

			<View style={styles.stopwatch}>
				<Text style={styles.stopwatch.time}>{formatStopwatch(time)}</Text>
				<View style={styles.stopwatch.buttonContainer}>
					{running ? (
						<>
							<Pressable onPress={lap} style={[styles.stopwatch.button, styles.stopwatch.lapColor]}>
								<Text style={[styles.stopwatch.button.text, styles.stopwatch.lapColor]}>Lap</Text>
							</Pressable>
							<Pressable onPress={pause} style={[styles.stopwatch.button, styles.stopwatch.stopColor]}>
								<Text style={[styles.stopwatch.button.text, styles.stopwatch.stopColor]}>Stop</Text>
							</Pressable>
						</>
					) : (
						<>
							<Pressable onPress={reset} style={[styles.stopwatch.button, styles.stopwatch.resetColor]}>
								<Text style={[styles.stopwatch.button.text, styles.stopwatch.resetColor]}>Reset</Text>
							</Pressable>
							<Pressable onPress={start} style={[styles.stopwatch.button, styles.stopwatch.startColor]}>
								<Text style={[styles.stopwatch.button.text, styles.stopwatch.startColor]}>Start</Text>
							</Pressable>
						</>
					)}
				</View>
			</View>
			<ScrollView style={styles.scroll}>
				{laps &&
					laps.map((lap, index) => (
						<Text
							key={index}
							style={[
								styles.stopwatch.lapItem,
								{ color: bestLap === index ? '#29ce52' : worstLap === index ? '#fe4034' : '#fff' }
							]}
						>
							{`Lap ${index + 1}: ${formatStopwatch(lap)}`}
						</Text>
					))}
			</ScrollView>
		</View>
	);
}
