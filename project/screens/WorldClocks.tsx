// External dependencies
import { Alert, BackHandler, View, Button, Modal, FlatList, TextInput, ScrollView } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Internal dependencies
import { TimeContext } from '../contexts/Time';
import { getDetailedTimezone, getTime, stringMatch } from '../misc';
import { IClock, ITimezone } from '../interfaces/';
import WorldClock from '../components/WorldClock';

export default function WorldClocks() {
	const { allTimezones, savedTimezones } = useContext(TimeContext);
	const [clocks, setClocks] = useState<IClock[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [search, setSearch] = useState('');

	useEffect(() => {
		(async () => {
			try {
				savedTimezones.forEach((timezone: ITimezone) => {
					const clock: IClock = {
						time: getTime(timezone.offset) as string,
						timezone: timezone.offset_str,
						offset: timezone.offset,
						city: timezone.city
					};

					setClocks((clocks: IClock[]) => [...clocks, clock]);
				});
			} catch (e) {
				// An error occurred, notify user
				Alert.alert('Something went wrong', 'Please try again later', [
					{ text: 'OK', onPress: () => BackHandler.exitApp() }
				]);
			}
		})();
	}, [savedTimezones]);

	return (
		<View style={{ backgroundColor: '#e6f3ff', height: '100%' }}>
			<Appbar.Header style={{ backgroundColor: '#0073e6' }}>
				<Appbar.Action icon="clock-edit-outline" />
				<Appbar.Content title="World clocks" titleStyle={{ alignSelf: 'center' }} />
				<Appbar.Action icon="plus" onPress={() => setModalVisible(true)} />
			</Appbar.Header>
			<ScrollView>
				{savedTimezones &&
					clocks.length > 0 &&
					clocks.map((clock: IClock, index: number) => (
						<WorldClock
							key={index}
							startTime={clock.time}
							timezone={clock.timezone}
							offset={clock.offset}
							city={clock.city}
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
						data={allTimezones.map((timezone: string) => timezone.replace(/_/g, ' '))}
						renderItem={({ item }) => (
							<View key={item}>
								{stringMatch(item, search) && (
									<Button
										title={item}
										accessibilityLabel="Go back"
										color="#ff7d2d"
										onPress={async () => {
											// Get detailed timezone info
											const timezone: ITimezone = await getDetailedTimezone(item);

											// Create clock object
											const clock: IClock = {
												time: getTime(timezone.offset) as string,
												timezone: timezone.offset_str,
												offset: timezone.offset,
												city: timezone.city
											};

											// Add clock to state
											setClocks((clocks: IClock[]) => [...clocks, clock]);

											// Get selected timezones from AsyncStorage
											const storedTimezones = JSON.parse(
												(await AsyncStorage.getItem('savedTimezones')) || '[]'
											);

											// Add selected timezone to AsyncStorage
											if (storedTimezones) {
												storedTimezones.push(timezone);
												AsyncStorage.setItem('savedTimezones', JSON.stringify(storedTimezones));
											}

											// Close modal and clear search
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
