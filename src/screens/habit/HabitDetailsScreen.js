import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, LogBox, TouchableOpacity, Platform, Image } from 'react-native';
//LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);  // dates are non-serializable values
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Divider, Provider, Button } from 'react-native-paper';
import { width } from '../../utils/Scaling';
import Modal from 'react-native-modal';
import Colors from '../../utils/Colors';

import { deleteHabit, switchFavorite, resetHabit } from '../../store/habitSlice';
import CalendarDetails from '../../components/CalendarDetails';
import StatisticsDetails from '../../components/StatisticsDetails';

// icons
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

const HabitDetailsScreen = ({ navigation, route }) => {
    const { selectedHabit } = route.params;
    const habits = useSelector((state) => state.habits.habits);
    const accentColor = useSelector(state => state.settings.accentColor);

    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('Reset');

    const [habit, setHabit] = useState();
    const [habitTitle, setHabitTitle] = useState();
    const [detailType, setDetailType] = useState('Calendar');

    const dispatch = useDispatch();

    const checkGoalType = () => {
        if (habit.goal.type === 'Off') {
            setHabitTitle(habit.name);
        } else if (habit.goal.type === 'Amount') {
            setHabitTitle(habit.name + ' ' + habit.goal.target + ' ' + habit.goal.unit);
        } else if (habit.goal.type === 'Duration') {
            if (habit.goal.hours > 0) {
                if (habit.goal.minutes > 0) {
                    setHabitTitle(habit.name + ' for ' + habit.goal.hours + 'h ' + habit.goal.minutes + 'min');
                } else if (habit.goal.hours == 1) {
                    setHabitTitle(habit.name + ' for ' + habit.goal.hours + ' hour');
                } else {
                    setHabitTitle(habit.name + ' for ' + habit.goal.hours + ' hours');
                }
            } else {
                if (habit.goal.minutes == 1) {
                    setHabitTitle(habit.name + ' for ' + habit.goal.minutes + ' minute');
                } else {
                    setHabitTitle(habit.name + ' for ' + habit.goal.minutes + ' minutes');
                }
            }
        } else if (habit.goal.type === 'Checklist') {
            if (habit.goal.subtasks.length == 1) {
                setHabitTitle(habit.name + ' (1 subtask)');
            } else {
                setHabitTitle(habit.name + ' (' + habit.goal.subtasks.length + ' subtasks)');
            }
        }
    };

    const checkHabitTitle = () => {
        if (width < 550) {
            if (habitTitle.length > 35) {
                setHabitTitle(habitTitle.slice(0, 33) + ' ...');
            }
        }
    };

    useEffect(() => {
        let habitIndex = habits.findIndex(object => object.id === selectedHabit.id);
        setHabit(habits[habitIndex]);
    }, [habits]);

    useEffect(() => {
        if (habit != null) {
            checkGoalType();

            navigation.setOptions({
                headerRight: () => (
                    <View style={{ flexDirection: 'row', right: 25, top: 2 }}>
                        <TouchableOpacity
                            style={{ right: 18 }}
                            onPress={() => navigation.navigate('DetailsStack', { screen: 'EditHabit', params: { habit } })}
                        >
                            <Octicons name='pencil' size={24} color='white'/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setMenuVisible(true)}
                        >
                            <Ionicons name='ellipsis-vertical' size={25} color='white'/>
                        </TouchableOpacity>
                    </View>
                )
            });
        }
    }, [habit]);    // maybe [habit, habits]

    useEffect(() => {
        if (habitTitle != null) {
            checkHabitTitle();
        }
    }, [habitTitle]);

    const ModalText = () => {
        if (modalType === 'Reset') {
            return (
                <View style={{ height: 120, paddingHorizontal: 15, paddingTop: 15 }}>
                    <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 20 : 17, textAlign: 'center' }}>
                        Are you sure about resetting this habit?
                    </Text>
                    <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                        Resetting a habit will delete all its data and set its start date to today
                    </Text>
                </View>
            );
        } else if (modalType === 'Delete') {
            return (
                <View style={{ height: 102, paddingHorizontal: 15, paddingTop: 15 }}>
                    <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 20 : 17, textAlign: 'center' }}>
                        Are you sure about deleting this habit?
                    </Text>
                    <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                        You cannot undo this deletion!
                    </Text>
                </View>
            );
        }
    };

    const ModalButton = () => {
        if (modalType === 'Reset') {
            return (
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center', height: 50, borderTopWidth: width > 550 ? 1 : 0.75, borderTopColor: 'white' }}
                    onPress={() => {
                        setModalVisible(false);
                        dispatch(resetHabit(habit.id));
                    }}
                >
                    <Text style={[styles.modalButtonText, { color: 'white' }]}>Reset</Text>
                </TouchableOpacity>
            );
        } else if (modalType === 'Delete') {
            return (
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center', height: 50, backgroundColor: '#b32400', borderBottomRightRadius: 20,
                        borderTopWidth: width > 550 ? 1 : 0.75, borderTopColor: 'white', borderLeftWidth: 0.5, borderLeftColor: 'white'
                    }}
                    onPress={() => {
                        setModalVisible(false);
                        dispatch(deleteHabit(habit.id));
                        navigation.goBack();
                    }}
                >
                    <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View style={styles.screen}>
            <Text style={styles.headerText}>{habitTitle}</Text>
            <View style={{ flexDirection: 'row', height: 50, width: '100%' }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: Colors.theme,
                        borderBottomColor: detailType === 'Calendar' ? accentColor : Colors.subTheme,
                        borderBottomWidth: detailType === 'Calendar' ? 2 : 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => setDetailType('Calendar')}
                >
                    <Text style={[styles.tabText, { color: detailType === 'Calendar' ? 'white' : 'grey' }]}>CALENDAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: Colors.theme,
                        borderBottomColor: detailType === 'Stats' ? accentColor : Colors.subTheme,
                        borderBottomWidth: detailType === 'Stats' ? 2 : 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => setDetailType('Stats')}
                >
                    <Text style={[styles.tabText, { color: detailType === 'Stats' ? 'white' : Colors.lightGrey }]}>STATISTICS</Text>
                </TouchableOpacity>
            </View>

            <Provider>
                <View style={{ position: 'absolute', right: 20, top: -80 }}>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={<Button/>}  // leave blank
                        contentStyle={styles.menuContainer}
                    >
                        <Menu.Item title="Set Favorite" titleStyle={{ color: 'white', right: 15, fontWeight: 'bold', fontSize: width > 550 ? 19 : 17 }}
                            icon={() => (
                                // change text and image if habit is already a favorite
                                <Image
                                    source={habit.favorite === true
                                        ? require('../../assets/images/favorite2.png')
                                        : require('../../assets/images/favorite.png')}
                                    style={{ width: 27, height: 27, tintColor: 'white', right: 1 }}
                                />
                            )}
                            onPress={() => {
                                setMenuVisible(false);
                                dispatch(switchFavorite(habit.id));
                            }}
                        />
                        <Divider style={{ backgroundColor: 'white' }}/>
                        <Menu.Item title="Reset" titleStyle={{ color: 'white', right: 15, fontWeight: 'bold', fontSize: width > 550 ? 19 : 17 }} 
                            icon={() => (
                                <EvilIcons name='undo' size={38} color='white' style={{ right: 7 }}/>
                            )}
                            onPress={() => {
                                setMenuVisible(false);
                                setModalType('Reset');
                                setModalVisible(true);
                            }}
                        />
                        <Divider style={{ backgroundColor: 'white' }}/>
                        <Menu.Item title="Delete" titleStyle={{ color: '#cc2900', right: 15, fontWeight: 'bold', fontSize: width > 550 ? 19 : 17 }}
                            icon={() => (
                                <Image
                                    source={require('../../assets/images/trash.png')}
                                    style={{ width: 24, height: 24, tintColor: '#cc2900' }}
                                />
                            )}
                            onPress={() => {
                                setMenuVisible(false);
                                setModalType('Delete');
                                setModalVisible(true);
                            }}
                        />
                    </Menu>
                </View>

                {/* Put remaining content inside provider */}
                {habit  // wait for habit to be assigned a value before passing it to the details components
                    ? <View style={{ flex: 1 }}>
                        {detailType === 'Calendar'
                            ? <CalendarDetails habit={habit}/>
                            : <StatisticsDetails habit={habit}/>
                        }
                    </View>
                    : null
                }
            </Provider>

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationInTiming={1}
                animationOutTiming={1}
                backdropOpacity={0.45}
            >
                <View style={[styles.modalContainer, { height: modalType === 'Reset' ? 170 : 152 }]}>
                    {ModalText()}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', flex: 1, borderColor: 'white' }}>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center', borderTopWidth: width > 550 ? 1 : 0.75, borderTopColor: 'white' }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <View style={{ width: width > 550 ? 1 : 0.5, height: 50, backgroundColor: 'white' }}/>
                        {ModalButton()}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

HabitDetailsScreen.navigationOptions = ({ route }) => {
    const { headerRight } = route.params;

    return {
        title: null,
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: Colors.theme
        },
        headerRight
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    headerText: {
        color: 'white',
        fontSize: width > 550 ? 22 : 20,
        marginBottom: 5,
        marginTop: Platform.OS === 'ios' ? 5 : 0,
        left: 18,
        fontFamily: 'roboto-medium'
    },
    tabText: {
        fontSize: width > 550 ? 20 : 17,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    menuContainer: {
        backgroundColor: Colors.subTheme,
        paddingVertical: -10,
        borderRadius: 6,
        bottom: 80,
        right: width > 550 ? 0 : -5,
        width: width > 550 ? 190 : 170
    },
    modalContainer: {
        backgroundColor: Colors.subTheme,
        width: width > 550 ? '75%' : '85%',
        alignSelf: 'center',
        borderRadius: 20
    },
    modalButtonText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        alignSelf: 'center',
        fontFamily: 'roboto-medium'
    }
});

export default HabitDetailsScreen;