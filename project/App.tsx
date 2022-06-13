// External dependencies
import { Alert, BackHandler } from 'react-native';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Internal dependencies
import Router from './Router';
import { getTimezones } from './misc';
import { ThemeContext, TimeContext } from './contexts/';
import { ITimezone } from './interfaces/';

export default function App() {
	const [isReady, setIsReady] = useState(false);
	const [allTimezones, setAllTimezones] = useState<string[]>([]);
	const [savedTimezones, setSavedTimezones] = useState<ITimezone[]>([]);
	const [theme, setTheme] = useState<'light' | 'dark'>('light');

	useEffect(() => {
		(async () => {
			try {
				// Splash screen is shown until all async tasks are done.
				SplashScreen.preventAutoHideAsync();
				setAllTimezones(await getTimezones());

				// Get selected timezones from async storage.
				const storedTimezones = await AsyncStorage.getItem('savedTimezones');

				if (storedTimezones) setSavedTimezones(JSON.parse(storedTimezones));

				// Get saved theme preference from async storage.
				const storedTheme = await AsyncStorage.getItem('theme');

				if (storedTheme) setTheme(storedTheme as 'light' | 'dark');
				else {
					AsyncStorage.setItem('theme', 'light');
				}
			} catch (e) {
				// An error occurred, notify user
				Alert.alert('Something went wrong', 'Please try again later', [
					{ text: 'OK', onPress: () => BackHandler.exitApp() }
				]);
			} finally {
				// App is ready to render, hide splash screen
				setIsReady(true);
				SplashScreen.hideAsync();
			}
		})();
	}, []);

	if (!isReady) return null;
	else
		return (
			<ThemeContext.Provider value={{ theme }}>
				<TimeContext.Provider value={{ allTimezones, savedTimezones }}>
					<Router />
				</TimeContext.Provider>
			</ThemeContext.Provider>
		);
}
