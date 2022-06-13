// External dependencies
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import RadioButtonRN from 'radio-buttons-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

// Internal dependencies
import { getStyles } from '../misc';
import { store, setTheme } from '../Store';

export default function Settings() {
	const [styles, setStyles] = useState(getStyles(store.getState().theme) as any);
	const [theme] = useSelector((state: any) => [state.theme]);

	const options = [
		{
			label: 'Light',
			value: 'light'
		},
		{
			label: 'Dark',
			value: 'dark'
		}
	];

	useEffect(() => {
		setStyles(getStyles(theme));
		AsyncStorage.setItem('theme', theme);
	}, [theme]);

	return (
		<View style={styles.body}>
			<Appbar.Header style={styles.header}>
				<Appbar.Content title="Settings" titleStyle={styles.headerTitle} />
			</Appbar.Header>
			<View style={styles.background}>
				<Text style={styles.title}>Color preference</Text>
				<RadioButtonRN
					box={false}
					duration={300}
					activeColor={styles.bgPrimary}
					deactiveColor={styles.bgSecondary}
					textColor={styles.textTertiary}
					data={options}
					initial={options.findIndex((option) => option.value === theme) + 1}
					selectedBtn={(selected) => store.dispatch(setTheme(selected.value))}
				/>
			</View>
		</View>
	);
}
