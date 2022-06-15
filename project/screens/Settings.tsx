// External dependencies
import { View, Text, Appearance } from 'react-native';
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
	const [storedTheme, setStoredTheme] = useState(null as unknown);
	const [initialValue, setInitialValue] = useState(null as unknown);

	const options = [
		{
			label: 'Light',
			value: 'light'
		},
		{
			label: 'Dark',
			value: 'dark'
		},
		{
			label: 'System',
			value: 'os'
		}
	];

	useEffect(() => {
		setStyles(getStyles(theme));
	}, [theme]);

	useEffect(() => {
		(async () => {
			setStoredTheme((await AsyncStorage.getItem('theme')) || null);
			if (!initialValue) {
				options.forEach((option, index) => {
					if (storedTheme && option.value === storedTheme) setInitialValue(index + 1);
					else if (!storedTheme) setInitialValue(3);
				});
			}
		})();
	}, [storedTheme]);

	return (
		<View style={styles.body}>
			<Appbar.Header style={styles.header}>
				<Appbar.Content title="Settings" titleStyle={styles.header.title} />
			</Appbar.Header>
			<View style={styles.settings}>
				<Text style={styles.settings.title}>Color preference</Text>
				{initialValue && (
					<RadioButtonRN
						box={false}
						duration={300}
						activeColor={styles.settings.radio.activeColor}
						deactiveColor={styles.settings.radio.inactiveColor}
						textColor={styles.settings.radio.textColor}
						circleSize={styles.settings.radio.circleSize}
						data={options}
						initial={initialValue as number}
						selectedBtn={async (selected) => {
							if (!selected || (storedTheme && initialValue == 3)) return;

							if (selected.value === 'os') {
								store.dispatch(setTheme(Appearance.getColorScheme()));
								await AsyncStorage.removeItem('theme');
							} else {
								store.dispatch(setTheme(selected.value));
								await AsyncStorage.setItem('theme', selected.value);
							}
						}}
					/>
				)}
			</View>
		</View>
	);
}
