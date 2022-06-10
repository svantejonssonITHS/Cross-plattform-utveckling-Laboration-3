// External dependencies
import { useContext, useState } from 'react';
import { Alert, BackHandler, View, Button, Modal, FlatList, TextInput } from 'react-native';
import { Appbar } from 'react-native-paper';

// Internal dependencies
import { TimeContext } from '../contexts/Time';
import { getDetailedTimezone } from '../misc';

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
						<FlatList
							style={{ width: '100%' }}
							data={allTimezones}
							renderItem={({ item }) => (
								<View key={item}>
									{item.replace(/_/g, ' ').toLowerCase().includes(search.toLowerCase()) && (
										<Button
											title={item.replace(/_/g, ' ')}
											accessibilityLabel="Go back"
											color="#ff7d2d"
											onPress={async () => {
												createNewClock(await getDetailedTimezone(item));
												setModalVisible(false);
											}}
										/>
									)}
								</View>
							)}
						/>
					</View>
				</Modal>
			</Appbar.Header>
		</View>
	);
}
