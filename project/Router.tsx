// External dependencies
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, BackHandler } from 'react-native';

// Internal dependencies
import { Settings, WorldClocks } from './screens/';
import { getTimezones } from './misc';
import { TimeContext } from './contexts/';
import { ITimezone } from './interfaces/';
import { store, setTheme } from './Store';

export default function Router() {
	const Tab = createBottomTabNavigator();

	const [isReady, setIsReady] = useState(false);
	const [allTimezones, setAllTimezones] = useState<string[]>([]);
	const [savedTimezones, setSavedTimezones] = useState<ITimezone[]>([]);

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

				if (storedTheme) store.dispatch(setTheme(storedTheme));
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
	return (
		<TimeContext.Provider value={{ allTimezones, savedTimezones }}>
			<NavigationContainer>
				<Tab.Navigator
					initialRouteName="World clocks"
					screenOptions={({ route }) => ({
						headerShown: false,
						tabBarStyle: {
							backgroundColor: '#0073e6'
						},
						tabBarActiveTintColor: '#ff7d2d',
						tabBarInactiveTintColor: '#fff',
						tabBarIcon: ({ focused }) => {
							let name: string;
							let color: string;

							switch (route.name) {
								case 'World clocks':
									name = 'language';
									break;
								case 'Settings':
									name = 'settings';
									break;
								default:
									name = 'warning';
									break;
							}

							if (focused) color = '#ff7d2d';
							else color = '#fff';

							return <MaterialIcons name={name as never} size={24} color={color} />;
						}
					})}
				>
					<Tab.Screen name="World clocks" component={WorldClocks} />
					<Tab.Screen name="Settings" component={Settings} />
				</Tab.Navigator>
			</NavigationContainer>
		</TimeContext.Provider>
	);
}
