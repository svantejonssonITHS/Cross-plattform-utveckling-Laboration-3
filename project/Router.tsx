// External dependencies
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, BackHandler, Appearance } from 'react-native';
import { useSelector } from 'react-redux';

// Internal dependencies
import { Settings, Stopwatch, WorldClocks } from './screens/';
import { getTimezones, getStyles } from './misc';
import { TimeContext } from './contexts/';
import { ITimezone } from './interfaces/';
import { store, setTheme } from './Store';

export default function Router() {
	const Tab = createBottomTabNavigator();

	const [isReady, setIsReady] = useState(false);
	const [allTimezones, setAllTimezones] = useState<string[]>([]);
	const [savedTimezones, setSavedTimezones] = useState<ITimezone[]>([]);
	const [theme] = useSelector((state: any) => [state.theme]);
	const [styles, setStyles] = useState(getStyles(store.getState().theme) as any);

	useEffect(() => {
		setStyles(getStyles(theme));
	}, [theme]);

	useEffect(() => {
		(async () => {
			if (!isReady) {
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
						store.dispatch(setTheme(Appearance.getColorScheme()));
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
							backgroundColor: styles.colorPrimary,
							borderTopWidth: 0
						},
						tabBarActiveTintColor: styles.colorAccent,
						tabBarInactiveTintColor: '#fff',
						tabBarIcon: ({ focused }) => {
							let name: string;
							let color: string;

							switch (route.name) {
								case 'World clocks':
									name = 'language';
									break;
								case 'Stopwatch':
									name = 'timer';
									break;
								case 'Settings':
									name = 'settings';
									break;
								default:
									name = 'warning';
									break;
							}

							if (focused) color = styles.colorAccent;
							else color = '#fff';

							return <MaterialIcons name={name as never} size={24} color={color} />;
						}
					})}
				>
					<Tab.Screen name="World clocks" component={WorldClocks} />
					<Tab.Screen name="Stopwatch" component={Stopwatch} />
					<Tab.Screen name="Settings" component={Settings} />
				</Tab.Navigator>
			</NavigationContainer>
		</TimeContext.Provider>
	);
}
