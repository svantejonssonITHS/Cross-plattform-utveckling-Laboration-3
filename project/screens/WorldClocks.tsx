// External dependencies
import { View } from 'react-native';
import { useContext } from 'react';
import { Appbar } from 'react-native-paper';

// Internal dependencies
import { TimeContext } from '../contexts/Time';

export default function App() {
	const { allTimezones, selectedTimezones } = useContext(TimeContext);

	return (
		<View style={{ backgroundColor: '#e6f3ff', height: '100%' }}>
			<Appbar.Header style={{ backgroundColor: '#0073e6' }}>
				<Appbar.Action icon="clock-edit-outline" />
				<Appbar.Content title="World clocks" titleStyle={{ alignSelf: 'center' }} />
				<Appbar.Action icon="plus" />
			</Appbar.Header>
		</View>
	);
}
