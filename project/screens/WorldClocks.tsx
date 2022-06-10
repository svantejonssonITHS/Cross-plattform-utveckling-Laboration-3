// External dependencies
import { Alert, BackHandler, View, Button, Modal, FlatList, TextInput, ScrollView } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Internal dependencies
import { TimeContext } from '../contexts/Time';
import { getDetailedTimezone, getTime, getOffset } from '../misc';
import WorldClock from '../components/WorldClock';

export default function WorldClocks() {
	const { allTimezones, selectedTimezones } = useContext(TimeContext);
	const [clocks, setClocks] = useState<object[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [search, setSearch] = useState('');

	useEffect(() => {
		(async () => {
			try {
				selectedTimezones.forEach((timezone: string[]) => {
					const clock = {
						startTime: getTime(getOffset(timezone.utc_offset) as number),
						offset: timezone.utc_offset,
						city: timezone.timezone
					};

					setClocks((clocks: object) => [...clocks, clock]);
				});
			} catch (e) {
				// An error occurred, notify user
				Alert.alert('Something went wrong', 'Please try again later', [
					{ text: 'OK', onPress: () => BackHandler.exitApp() }
				]);
			}
		})();
	}, [selectedTimezones]);

	return (
		<View style={{ backgroundColor: '#e6f3ff', height: '100%' }}>
			<Appbar.Header style={{ backgroundColor: '#0073e6' }}>
				<Appbar.Action icon="clock-edit-outline" />
				<Appbar.Content title="World clocks" titleStyle={{ alignSelf: 'center' }} />
				<Appbar.Action icon="plus" onPress={() => setModalVisible(true)} />
			</Appbar.Header>
			<ScrollView>
				{selectedTimezones &&
					clocks.length > 0 &&
					clocks.map((clock: object, index: number) => (
						<WorldClock
							key={index}
							startTime={clock.startTime}
							offset={clock.offset}
							city={clock.city.split(/\//g)[clock.city.split(/\//g).length - 1]}
						/>
					))}
			</ScrollView>
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
								{item.toLowerCase().includes(search.toLowerCase()) && (
									<Button
										title={item}
										accessibilityLabel="Go back"
										color="#ff7d2d"
										onPress={async () => {
											const timezone = await getDetailedTimezone(item);
											timezone.timezone = item;
											const clock = {
												startTime: getTime(getOffset(timezone.utc_offset) as number),
												offset: timezone.utc_offset,
												city: item
											};
											setClocks((clocks: object) => [...clocks, clock]);

											// Get selected timezones from AsyncStorage
											const timezonesInStorage =
												(await AsyncStorage.getItem('selectedTimezones')) || '[]';

											if (timezonesInStorage) {
												const timezones = JSON.parse(timezonesInStorage);
												timezones.push(timezone);
												AsyncStorage.setItem('selectedTimezones', JSON.stringify(timezones));
											}

											setModalVisible(false);
											setSearch('');
										}}
									/>
								)}
							</View>
						)}
					/>
				</View>
			</Modal>
		</View>
	);
}
