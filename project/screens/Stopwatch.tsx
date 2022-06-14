// External dependencies
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';

// Internal dependencies
import { getStyles } from '../misc';
import { store } from '../Store';

export default function Stopwatch() {
	const [styles, setStyles] = useState(getStyles(store.getState().theme) as any);
	const [theme] = useSelector((state: any) => [state.theme]);

	useEffect(() => {
		setStyles(getStyles(theme));
	}, [theme]);

	return (
		<View style={styles.body}>
			<Appbar.Header style={styles.header}>
				<Appbar.Content title="Stopwatch" titleStyle={styles.header.title} />
			</Appbar.Header>
		</View>
	);
}
