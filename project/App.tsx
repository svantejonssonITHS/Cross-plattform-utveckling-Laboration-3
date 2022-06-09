// External dependencies
import { Alert, BackHandler } from 'react-native';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Internal dependencies
import Router from './Router';
import { getTimezones } from './misc';
import { TimeContext } from './contexts/Time';

export default function App() {
	const [isReady, setIsReady] = useState(false);
	const [allTimezones, setAllTimezones] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				// Splash screen is shown until all async tasks are done.
				SplashScreen.preventAutoHideAsync();
				setAllTimezones(await getTimezones());
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
			<TimeContext.Provider value={{ allTimezones, selectedTimezones: [] }}>
				<Router />
			</TimeContext.Provider>
		);
}
