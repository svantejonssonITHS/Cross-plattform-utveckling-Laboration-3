// External dependencies
import { View, Text } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import RadioButtonRN from 'radio-buttons-react-native';

// Internal dependencies
import { ThemeContext } from '../contexts/';
import { getStyles } from '../misc';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
	const [theme, setTheme] = useState(useContext(ThemeContext).theme);
	const [styles, setStyles] = useState(getStyles(useContext(ThemeContext).theme) as any);

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
					selectedBtn={(selected) => setTheme(selected.value as 'light' | 'dark')}
				/>
			</View>
		</View>
	);
}
