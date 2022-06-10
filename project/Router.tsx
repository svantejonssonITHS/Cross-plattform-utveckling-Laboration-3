// External dependencies
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Internal dependencies
import WorldClocks from './screens/WorldClocks';

export default function Router() {
	const Tab = createBottomTabNavigator();
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName="WorldClocks"
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

						if (route.name === 'World clocks') name = 'language';
						else name = 'warning';

						if (focused) color = '#ff7d2d';
						else color = '#fff';

						return <MaterialIcons name={name} size={24} color={color} />;
					}
				})}
			>
				<Tab.Screen name="World clocks" component={WorldClocks} />
				<Tab.Screen name="Test" component={WorldClocks} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}
