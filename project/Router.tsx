// External dependencies
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Internal dependencies
import Home from './screens/Home';

export default function Router() {
	const Tab = createBottomTabNavigator();
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName="Home"
				screenOptions={{
					headerShown: false
				}}
			>
				<Tab.Screen name="Home" component={Home} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}
