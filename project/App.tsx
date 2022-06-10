// External dependencies
import { Alert, BackHandler } from 'react-native';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Internal dependencies
import Router from './Router';
import { getTimezones, getDetailedTimezone } from './misc';
import { TimeContext } from './contexts/Time';

export default function App() {
	const [isReady, setIsReady] = useState(false);
	const [allTimezones, setAllTimezones] = useState<string[]>([]);
	const [selectedTimezones, setSelectedTimezones] = useState<string[]>([]);

	useEffect(() => {
		(async () => {
			try {
				// Splash screen is shown until all async tasks are done.
				SplashScreen.preventAutoHideAsync();
				setAllTimezones(await getTimezones());

				// Get selected timezones from async storage.
				const storedTimezones = await AsyncStorage.getItem('selectedTimezones');

				if (storedTimezones) {
					await JSON.parse(storedTimezones).forEach(async (timezone: string) => {
						const detailedTimezone = await getDetailedTimezone(timezone.timezone);
						if (detailedTimezone) {
							setSelectedTimezones((timezones) => [...timezones, detailedTimezone]);
						}
					});
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
			<TimeContext.Provider value={{ allTimezones, selectedTimezones }}>
				<Router />
			</TimeContext.Provider>
		);
}
