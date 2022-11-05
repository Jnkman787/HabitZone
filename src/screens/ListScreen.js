import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { width, scale, verticalScale } from '../utils/Scaling';
import { useSelector, useDispatch } from 'react-redux';
import { generateWeeklyCalendarDates } from '../utils/Weekdays';
import Modal from 'react-native-modal';
import Colors from '../utils/Colors';

import ListHabitItem from '../components/ListHabitItem';

import { setSortType } from '../store/settingsSlice';

import CustomIcon from '../utils/CustomIcon';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const ListScreen = ({ navigation }) => {
    const habits = useSelector((state) => state.habits.habits);
    const accentColor = useSelector(state => state.settings.accentColor);
    const sortType = useSelector(state => state.settings.sortType);

    const [referenceDate] = useState(new Date());
    const [habitList, setHabitList] = useState(JSON.parse(JSON.stringify(habits)));  // avoid passing by reference
    const [listType, setListType] = useState('Active');
    const activeHabits = useRef([]);
    const endedHabits = useRef([]);
    const favoriteHabits = useRef([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        // provide options on how to list the habits (i.e. alphabetical, newest-to-oldest, oldest-to-newest, etc)
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRightStyle}>
                    <TouchableOpacity
                        style={{ right: 15, alignSelf: 'center' }}
                        onPress={() => setModal2Visible(true)}
                    >
                        <Feather name='info' size={26} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name='options-outline' size={32} color='white'/>
                    </TouchableOpacity>
                </View>
            )
        });
    }, []);

    // set the active, ended and favorites lists
    useEffect(() => {
        let today = new Date();
        today.setHours(0,0,0,0);

        let activeArray = [];
        let endedArray = [];
        let favoritesArray = [];

        for (let i = 0; i < habits.length; i++) {
            if (habits[i].endDate === null) {
                // add to active list
                activeArray.push(habits[i]);
            } else {
                let endDate = new Date(habits[i].endDate);
                // check if habit has reached its end date
                if (today >= endDate) {
                    // add to ended list
                    endedArray.push(habits[i]);
                } else {
                    // add to active list
                    activeArray.push(habits[i]);
                }
            }

            // add to favorite list
            if (habits[i].favorite === true) {
                favoritesArray.push(habits[i]);
            }
        }

        activeHabits.current = activeArray;
        endedHabits.current = endedArray;
        favoriteHabits.current = favoritesArray;

        sortHabitList(sortType);
        if (habits.length === 0) {
            navigation.navigate('Tab', { screen: 'Home' });
        }
    }, [habits, listType]);

    // set habitList without passing habits by reference so as not to alter the original list
    const sortHabitList = (option) => {
        if (option === 'Oldest') {
            if (listType === 'Active') {
                setHabitList(JSON.parse(JSON.stringify(activeHabits.current)));
            } else if (listType === 'Ended') {
                setHabitList(JSON.parse(JSON.stringify(endedHabits.current)));
            } else if (listType === 'Favorites') {
                setHabitList(JSON.parse(JSON.stringify(favoriteHabits.current)));
            }
        } else if (option === 'Newest') {
            if (listType === 'Active') {
                setHabitList(JSON.parse(JSON.stringify(activeHabits.current)).reverse());
            } else if (listType === 'Ended') {
                setHabitList(JSON.parse(JSON.stringify(endedHabits.current)).reverse());
            } else if (listType === 'Favorites') {
                setHabitList(JSON.parse(JSON.stringify(favoriteHabits.current)).reverse());
            }
        } else if (option === 'Alphabetical') {
            // acquire the latest list of habits before sorting them alphabetically
            let tempHabitList;
            if (listType === 'Active') {
                tempHabitList = JSON.parse(JSON.stringify(activeHabits.current));
            } else if (listType === 'Ended') {
                tempHabitList = JSON.parse(JSON.stringify(endedHabits.current));
            } else if (listType === 'Favorites') {
                tempHabitList = JSON.parse(JSON.stringify(favoriteHabits.current));
            }
            setHabitList(tempHabitList.sort((a,b) => a.name.localeCompare(b.name)));
        }
    };

    const SortOption = (option) => {
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', marginTop: width > 550 ? 25 : 22, marginHorizontal: 17 }}
                onPress={() => {
                    dispatch(setSortType(option));
                    sortHabitList(option);
                }}
            >
                <View style={styles.circle}>
                    <View style={[styles.dot, {
                        backgroundColor: option === sortType ? accentColor : null
                    }]}/>
                </View>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: width > 550 ? 20 : 17 }}>
                    {option === 'Alphabetical' ? 'Name (Alphabetical)' : null}
                    {option === 'Oldest' ? 'Date added (Oldest)' : null}
                    {option === 'Newest' ? 'Date added (Newest)' : null}
                </Text>
            </TouchableOpacity>
        );
    };

    const WeekdayCircle = (type) => {
        let today = new Date();

        let color1;
        let color2;
        if (type === 'inactive') { color1 = Colors.subTheme, color2 = Colors.subTheme }
        else if (type === 'disabled') { color1 = Colors.lightTheme, color2 = Colors.lightTheme }
        else if (type === 'partial') { color1 = '#806600', color2 = '#f4b842' }
        else if (type === 'completed') { color1 = '#004d32', color2 = '#43a964' }
        else if (type === 'missed') { color1 = '#800000', color2 = '#ff3333' }
        else if (type === 'in-progress') { color1 = '#395379', color2 = '#a8a8a8' }

        return (
            <View style={[styles.numberCircle, { backgroundColor: color1, borderColor: color2 }]}>
                <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 18 : 16 }}>{today.getDate()}</Text>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <View style={{ flexDirection: 'row', height: 50, width: '100%' }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: Colors.theme,
                        borderBottomColor: listType === 'Active' ? accentColor : Colors.subTheme,
                        borderBottomWidth: listType === 'Active' ? 2 : 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => setListType('Active')}
                >
                    <Text style={[styles.tabText, { color: listType === 'Active' ? 'white' : 'grey' }]}>ACTIVE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: Colors.theme,
                        borderBottomColor: listType === 'Ended' ? accentColor : Colors.subTheme,
                        borderBottomWidth: listType === 'Ended' ? 2 : 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => setListType('Ended')}
                >
                    <Text style={[styles.tabText, { color: listType === 'Ended' ? 'white' : Colors.lightGrey }]}>ENDED</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: Colors.theme,
                        borderBottomColor: listType === 'Favorites' ? accentColor : Colors.subTheme,
                        borderBottomWidth: listType === 'Favorites' ? 2 : 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => setListType('Favorites')}
                >
                    <Text style={[styles.tabText, { color: listType === 'Favorites' ? 'white' : Colors.lightGrey }]}>FAVORITES</Text>
                </TouchableOpacity>
            </View>

            <FlatList  // finish setting up the list before displaying
                data={habitList}
                renderItem={habitData =>
                    <ListHabitItem 
                        navigation={navigation} 
                        habit={habitData} 
                        week={generateWeeklyCalendarDates(6, 0, referenceDate)} 
                        finalItem={habitList[habitList.length - 1]}
                    />
                }
            />

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                onSwipeComplete={() => setModalVisible(false)}
                swipeDirection='down'
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.45}
                style={{ justifyContent: 'flex-end', margin: 0 }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.headerLayout}>
                        <Text style={styles.headerText}>Sort By</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <AntDesign name='close' size={29} color='white' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.border}/>

                    {SortOption('Alphabetical')}
                    {SortOption('Oldest')}
                    {SortOption('Newest')}
                </View>
            </Modal>

            <Modal
                isVisible={modal2Visible}
                onBackButtonPress={() => setModal2Visible(false)}
                onBackdropPress={() => setModal2Visible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.55}
            >
                <View style={styles.modalContainer2}>
                    <View style={styles.headerLayout}>
                        <Text style={styles.headerText}>Color Code</Text>
                        <TouchableOpacity onPress={() => setModal2Visible(false)}>
                            <AntDesign name='close' size={29} color='white' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.border}/>

                    <View style={{ marginTop: width > 550 ? verticalScale(18) : 12, marginLeft: width > 550 ? '25%' : '17%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {WeekdayCircle('inactive')}
                            <Text style={styles.labelText}>Inactive</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                            {WeekdayCircle('disabled')}
                            <Text style={styles.labelText}>Not scheduled</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                            {WeekdayCircle('in-progress')}
                            <Text style={styles.labelText}>In progress</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                            {WeekdayCircle('partial')}
                            <Text style={styles.labelText}>Partially completed</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                            {WeekdayCircle('completed')}
                            <Text style={styles.labelText}>Completed</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                            {WeekdayCircle('missed')}
                            <Text style={styles.labelText}>Missed</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

ListScreen.navigationOptions = ({ route }) => {
    const { headerRight } = route.params;

    return {
        title: null,
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: Colors.theme
        },
        headerLeft: () => (
            <Text style={styles.headerLeftStyle}>Habits</Text>
        ),
        headerRight,
        tabBarIcon: ({ focused }) => (
            <CustomIcon name={focused ? 'list' : 'list-outline'} size={28} color='white' style={{ top: 2, right: width > 550 ? scale(15) : 10 }}/>
        )
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    headerLeftStyle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'roboto-medium',
        left: 25,
        top: 2
    },
    headerRightStyle: {
        right: 25,
        top: 2,
        flexDirection: 'row'
    },
    tabText: {
        fontSize: width > 550 ? 20 : 17,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    modalContainer: {
        backgroundColor: Colors.subTheme,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: width > 550 ? verticalScale(30) : 35
    },
    headerLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: width > 550 ? verticalScale(15) : 15,
        marginHorizontal: width > 550 ? scale(17) : 17
    },
    headerText: {
        color: 'white',
        fontSize: width > 550 ? 22 : 20,
        fontFamily: 'roboto-medium'
    },
    border: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        width: '100%'
    },
    circle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    },
    dot: {
        height: 16,
        width: 16,
        borderRadius: 8,
        zIndex: 1
    },
    modalContainer2: {
        backgroundColor: Colors.subTheme,
        borderRadius: 20,
        paddingBottom: width > 550 ? verticalScale(18) : 20,
        width: width > 550 ? '75%' : '95%',
        alignSelf: 'center'
    },
    numberCircle: {
        height: width > 550 ? 41 : 36,
        width: width > 550 ? 41 : 36,
        borderRadius: width > 550 ? 18 : 16,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    labelText: {
        color: 'white',
        fontSize: width > 550 ? 19 : 17,
        marginLeft: 20
    }
});

export default ListScreen;