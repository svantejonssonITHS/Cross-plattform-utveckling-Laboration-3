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
import { TimeContext } from '../contexts/';
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
		(async () => {
			try {
				setClocks(
					savedTimezones.map((timezone: ITimezone) => {
						return {
							time: getTime(timezone.offset) as string,
							timezone: timezone.offset_str,
							offset: timezone.offset,
							city: timezone.city
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
	}, [savedTimezones, theme]);

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
							onDelete={(city) => {
								// TODO: Remove clock from array 'clocks' and from AsyncStorage
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
