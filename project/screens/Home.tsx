// Dependencies
import { StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react';
import { TimeContext } from '../contexts/Time';

export default function App() {
	const { allTimezones, selectedTimezones } = useContext(TimeContext);

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
