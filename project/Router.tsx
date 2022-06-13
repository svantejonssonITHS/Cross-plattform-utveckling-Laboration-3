// External dependencies
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Internal dependencies
import { Settings, WorldClocks } from './screens/';

export default function Router() {
	const Tab = createBottomTabNavigator();
	return (
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
	);
}
