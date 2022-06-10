// External dependencies
import { View, Button, Modal, ScrollView, TextInput } from 'react-native';
import { useContext, useState } from 'react';
import { Appbar } from 'react-native-paper';

// Internal dependencies
import { TimeContext } from '../contexts/Time';

export default function WorldClocks() {
	const { allTimezones, selectedTimezones } = useContext(TimeContext);
	const [modalVisible, setModalVisible] = useState(false);
	const [search, setSearch] = useState('');

	return (
		<View style={{ backgroundColor: '#e6f3ff', height: '100%' }}>
			<Appbar.Header style={{ backgroundColor: '#0073e6' }}>
				<Appbar.Action icon="clock-edit-outline" />
				<Appbar.Content title="World clocks" titleStyle={{ alignSelf: 'center' }} />
				<Appbar.Action icon="plus" onPress={() => setModalVisible(true)} />
				<Modal animationType="slide" visible={modalVisible} transparent={true}>
					<View
						style={{
							backgroundColor: '#e6f3ff',
							height: '95%',
							width: '100%',
							alignItems: 'center',
							position: 'absolute',
							bottom: 0,
							borderTopStartRadius: 10,
							borderTopEndRadius: 10
						}}
					>
						<View style={{ width: '100%', padding: 10, flexDirection: 'row' }}>
							<TextInput
								onChangeText={setSearch}
								value={search}
								placeholder="Search"
								autoFocus={true}
								autoCorrect={false}
								autoComplete={'off'}
								returnKeyType={'search'}
								style={{
									backgroundColor: '#b5dbff',
									padding: 5,
									borderRadius: 10,
									flex: 1,
									marginRight: 10
								}}
							/>
							<Button
								title="Cancel"
								accessibilityLabel="Go back"
								color="#ff7d2d"
								onPress={() => setModalVisible(false)}
							/>
						</View>
						<ScrollView style={{ width: '100%' }}>
							{allTimezones.map((item: string) => (
								<View key={item}>
									{item.toLowerCase().includes(search.toLowerCase()) && (
										<Button
											title={item}
											accessibilityLabel="Go back"
											color="#ff7d2d"
											onPress={() => setModalVisible(false)}
										/>
									)}
								</View>
							))}
						</ScrollView>
					</View>
				</Modal>
			</Appbar.Header>
		</View>
	);
}
