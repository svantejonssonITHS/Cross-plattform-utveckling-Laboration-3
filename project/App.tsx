import { StyleSheet, BackHandler, Alert, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				// Splash screen is shown until all async tasks are done.
				SplashScreen.preventAutoHideAsync();
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

	if (!isReady) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Text>Hello World!</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
