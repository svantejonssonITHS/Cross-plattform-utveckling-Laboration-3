// External dependencies
import {
	Alert,
	BackHandler,
	View,
	Button,
	Modal,
	FlatList,
	TextInput,
	ScrollView,
	InputAccessoryView,
	Platform
} from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

// Internal dependencies
import { TimeContext } from '../contexts/Time';
import { getDetailedTimezone, getTime, stringMatch, getStyles } from '../misc';
import { IClock, ITimezone } from '../interfaces/';
import WorldClock from '../components/WorldClock';

import { store } from '../Store';

export default function WorldClocks() {
	const { allTimezones, savedTimezones } = useContext(TimeContext);
	const [clocks, setClocks] = useState<IClock[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [search, setSearch] = useState('');
	const [theme] = useSelector((state: any) => [state.theme]);
	const [styles, setStyles] = useState(getStyles(store.getState().theme) as any);
	const [showDelete, setShowDelete] = useState(false);

	useEffect(() => {
		setStyles(getStyles(theme));
	}, [theme]);

	useEffect(() => {
		(async () => {
			try {
				setClocks(
					savedTimezones.map((timezone: ITimezone) => {
						return {
							time: getTime(timezone.offset) as string,
							timezone: timezone.offset_str,
							offset: timezone.offset,
							city: timezone.city,
							timezone_api: timezone.name_api
						} as IClock;
					})
				);
			} catch (e) {
				// An error occurred, notify user
				Alert.alert('Something went wrong', 'Please try again later', [
					{ text: 'OK', onPress: () => BackHandler.exitApp() }
				]);
			}
		})();
	}, [savedTimezones]);

	return (
		<View style={styles.body}>
			<Appbar.Header style={styles.header}>
				<Appbar.Action icon="clock-edit-outline" onPress={() => setShowDelete(!showDelete)} />
				<Appbar.Content title="World clocks" titleStyle={styles.header.title} />
				<Appbar.Action icon="plus" onPress={() => setModalVisible(true)} />
			</Appbar.Header>
			<ScrollView style={styles.scrollContainer}>
				{savedTimezones &&
					clocks.length > 0 &&
					clocks.map((clock: IClock, index: number) => (
						<WorldClock
							key={index}
							startTime={clock.time}
							timezone={clock.timezone}
							offset={clock.offset}
							city={clock.city}
							onDelete={async (city) => {
								// TODO: Remove clock from array 'clocks' and from AsyncStorage
								const newClocks = clocks.filter((clock) => clock.city !== city);
								setClocks(newClocks);
								let storedTimezones = await AsyncStorage.getItem('savedTimezones');

								if (storedTimezones) {
									storedTimezones = JSON.parse(storedTimezones) as never;
									storedTimezones = (storedTimezones as any).filter(
										(timezone: ITimezone) => timezone.city !== city
									);
									await AsyncStorage.setItem('savedTimezones', JSON.stringify(storedTimezones));
								}

								setShowDelete(false);
							}}
							showDelete={showDelete}
						/>
					))}
			</ScrollView>
			<Modal animationType="slide" visible={modalVisible} transparent={true}>
				<View style={styles.modal}>
					<View style={styles.search.container}>
						<TextInput
							onChangeText={setSearch}
							value={search}
							placeholder="Search"
							autoFocus={true}
							autoCorrect={false}
							autoComplete={'off'}
							returnKeyType={'search'}
							style={styles.search.input}
							inputAccessoryViewID="search"
						/>
						<Button
							title="Cancel"
							accessibilityLabel="Go back"
							color={styles.search.button.color}
							onPress={() => {
								setSearch('');
								setShowDelete(false);
								setModalVisible(false);
							}}
						/>
						{Platform.OS === 'ios' && (
							<InputAccessoryView nativeID="search">
								<View style={styles.search.button}>
									<Button onPress={() => setSearch('')} title="Clear search" />
								</View>
							</InputAccessoryView>
						)}
					</View>
					<FlatList
						style={styles.scroll}
						data={allTimezones
							.map((timezone: string) => timezone.replace(/_/g, ' '))
							.filter((timezone) => !clocks.some((tz) => tz.timezone_api === timezone))}
						renderItem={({ item }) => (
							<View key={item}>
								{stringMatch(item, search) && (
									<Button
										title={item}
										accessibilityLabel="Add world clock"
										color="#ff7d2d"
										onPress={async () => {
											// Get detailed timezone info
											const timezone: ITimezone = await getDetailedTimezone(item);

											// Create clock object
											const clock: IClock = {
												time: getTime(timezone.offset) as string,
												timezone: timezone.offset_str,
												offset: timezone.offset,
												city: timezone.city,
												timezone_api: timezone.name_api
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
											setSearch('');
											setShowDelete(false);
											setModalVisible(false);
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
