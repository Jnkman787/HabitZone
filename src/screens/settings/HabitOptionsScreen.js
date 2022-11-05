import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { width, verticalScale, scale } from '../../utils/Scaling';
import Modal from 'react-native-modal';
import Colors from '../../utils/Colors';
import SwitchSelector from 'react-native-switch-selector';
import { useDispatch, useSelector } from 'react-redux';

import { setStartingWeekday, setFinishedPosition, setSortType, setVacationMode } from '../../store/settingsSlice';

import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

// 1. done
// 2. done
// 3. done
// 4. Vacation mode (UI finished, now finish all other steps)
// 4.5 Vacation dates (check on HomeScreen if vacation mode is active; if yes, add today's date to the array of dates)
// * but first check if today's date is already in the array of vacation dates

const HabitOptionsScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modal3Visible, setModal3Visible] = useState(false);
    const [tempModalVisible, setTempModalVisible] = useState(false);

    const startingWeekday = useSelector(state => state.settings.startingWeekday);
    const finishedPosition = useSelector(state => state.settings.finishedPosition);
    const sortType = useSelector(state => state.settings.sortType);
    const vacationMode = useSelector(state => state.settings.vacationMode);

    const accentColor = useSelector(state => state.settings.accentColor);

    const dispatch = useDispatch();

    const optionAction = (option) => {
        if (option === 'firstDay') {
            setModalVisible(true);
        } else if (option === 'sort') {
            setModal2Visible(true);
        }
    };

    const HabitOption = (option) => {
        let optionName;
        let label;
        if (option === 'firstDay') {
            optionName = 'First day of week';
            if (startingWeekday === 'Sun') { label = 'Sunday'; }
            else if (startingWeekday === 'Mon') { label = 'Monday'; }
            else if (startingWeekday === 'Tue') { label = 'Tuesday'; }
            else if (startingWeekday === 'Wed') { label = 'Wednesday'; }
            else if (startingWeekday === 'Thu') { label = 'Thursday'; }
            else if (startingWeekday === 'Fri') { label = 'Friday'; }
            else if (startingWeekday === 'Sat') { label = 'Saturday'; }
        } else if (option === 'sort') {
            optionName = 'Habit list sort criteria';
            label = sortType;
        }

        return (
            <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => optionAction(option)}
            >
                <Text style={styles.optionText}>{optionName}</Text>
                <View style={styles.rightLayout}>
                    <Text style={styles.selectedText}>{label}</Text>
                    <AntDesign name='right' size={21} color='white' style={{ top: 1 }}/>
                </View>
            </TouchableOpacity>
        );
    };

    const WeekdayOption = (option) => {
        let weekday;
        if (option === 'Sun') { weekday = 'Sunday'; }
        else if (option === 'Mon') { weekday = 'Monday'; }
        else if (option === 'Tue') { weekday = 'Tuesday'; }
        else if (option === 'Wed') { weekday = 'Wednesday'; }
        else if (option === 'Thu') { weekday = 'Thursday'; }
        else if (option === 'Fri') { weekday = 'Friday'; }
        else if (option === 'Sat') { weekday = 'Saturday'; }

        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', marginTop: width > 550 ? 20 : 15, marginLeft: width > 550 ? 40 : 30 }}
                onPress={() => {
                    dispatch(setStartingWeekday(option));
                    setModalVisible(false);
                }}
            >
                <View style={styles.circle}>
                    <View style={[styles.dot, {
                        backgroundColor: option === startingWeekday ? accentColor : null
                    }]}/>
                </View>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: width > 550 ? 22 : 19 }}>{weekday}</Text>
            </TouchableOpacity>
        );
    };

    const SortOption = (option) => {
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', marginTop: width > 550 ? 25 : 22, marginHorizontal: 17 }}
                onPress={() => dispatch(setSortType(option))}
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

    return (
        <View style={styles.screen}>
            {HabitOption('firstDay')}
           
            <View style={[styles.optionContainer, { 
                flexDirection: 'column', alignItems: 'baseline', height: width > 550 ? 140 : 130, paddingVertical: 20
            }]}>
                <Text style={styles.optionText}>Finished habit position</Text>
                <SwitchSelector
                    initial={finishedPosition === 'Bottom' ? 0 : 1}
                    onPress={(value) => {
                        dispatch(setFinishedPosition(value));
                    }}
                    textColor={'white'}
                    buttonColor={accentColor}
                    fontSize={ width > 550 ? 20 : 17 }
                    backgroundColor={Colors.lightTheme}
                    animationDuration={250}
                    options={[
                        { label: 'Bottom', value: 'Bottom' },
                        { label: 'Keep', value: 'Keep' }
                    ]}
                    height={width > 550 ? 50 : 45}
                    style={{ width: width > 550 ? '60%' : '70%', top: 0, alignSelf: 'center' }}
                />
            </View>

            {HabitOption('sort')}

            <View style={styles.optionContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.optionText}>Vacation mode</Text>
                    <TouchableOpacity
                        onPress={() => setModal3Visible(true)}
                    >
                        <AntDesign name='questioncircle' size={20} color='white' style={{ marginLeft: 10 }}/>
                    </TouchableOpacity>
                </View>
                {/*<Switch
                    value={vacationMode}
                    trackColor={{ false: 'grey', true: accentColor}}
                    thumbColor={'white'}
                    onValueChange={() => dispatch(setVacationMode())}
                    style={{ transform: width > 550 ? [{ scaleX: 1.3 }, { scaleY: 1.3 }] : [] }}
                />*/}
                <TouchableOpacity
                    onPress={() => setTempModalVisible(true)}
                >
                    <Feather name='info' size={width > 550 ? 30 : 28} color='white'/>
                </TouchableOpacity>
            </View>

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.45}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.headerLayout}>
                        <Text style={styles.headerText}>First day of week</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <AntDesign name='close' size={29} color='white' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.border}/>

                    {WeekdayOption('Sun')}
                    {WeekdayOption('Mon')}
                    {WeekdayOption('Tue')}
                    {WeekdayOption('Wed')}
                    {WeekdayOption('Thu')}
                    {WeekdayOption('Fri')}
                    {WeekdayOption('Sat')}
                </View>
            </Modal>

            <Modal
                isVisible={modal2Visible}
                onBackButtonPress={() => setModal2Visible(false)}
                onBackdropPress={() => setModal2Visible(false)}
                onSwipeComplete={() => setModal2Visible(false)}
                swipeDirection='down'
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.45}
                style={{ justifyContent: 'flex-end', margin: 0 }}
            >
                <View style={styles.modal2Container}>
                    <View style={styles.headerLayout}>
                        <Text style={styles.headerText}>Sort By</Text>
                        <TouchableOpacity onPress={() => setModal2Visible(false)}>
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
                isVisible={modal3Visible}
                onBackButtonPress={() => setModal3Visible(false)}
                onBackdropPress={() => setModal3Visible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.55}
            >
                <View style={styles.modal3Container}>
                    <View style={{ height: width > 550 ? 115 : 100, paddingHorizontal: 15, paddingTop: 20 }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 20 : 17, textAlign: 'center' }}>
                            All habits will be skipped while on vacation mode, so your streaks will not be broken
                        </Text>
                    </View>
                    <View style={{ flex: 1, borderTopWidth: width > 550 ? 1 : 0.5, borderColor: 'white' }}>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center' }}
                            onPress={() => setModal3Visible(false)}
                        >
                            <Text style={{ color: 'white', fontSize: width > 550 ? 20 : 17, alignSelf: 'center' }}>OK, got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                isVisible={tempModalVisible}
                onBackButtonPress={() => setTempModalVisible(false)}
                onBackdropPress={() => setTempModalVisible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.55}
            >
                <View style={[styles.modal3Container, { height: width > 550 ? 165 : 140 }]}>
                    <View style={{ height: width > 550 ? 105 : 90, paddingHorizontal: 15, paddingTop: 20 }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 20 : 17, textAlign: 'center' }}>
                            This feature will soon be released in version 1.0.2
                        </Text>
                    </View>
                    <View style={{ flex: 1, borderTopWidth: width > 550 ? 1 : 0.5, borderColor: 'white' }}>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center' }}
                            onPress={() => setTempModalVisible(false)}
                        >
                            <Text style={{ color: 'white', fontSize: width > 550 ? 20 : 17, alignSelf: 'center' }}>Sounds good</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    optionContainer: {
        backgroundColor: Colors.subTheme,
        borderRadius: 15,
        alignSelf: 'center',
        height: width > 550 ? 90 : 80,
        width: width > 550 ? '80%' : '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width > 550 ? 20 : 15,
        marginTop: 15
    },
    optionText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        fontFamily: 'roboto-medium',
        bottom: 0.5
    },
    rightLayout: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectedText: {
        color: Colors.lightGrey,
        fontSize: width > 550 ? 18 : 15,
        marginRight: width > 550 ? 15 : 5
    },
    modalContainer: {
        backgroundColor: Colors.subTheme,
        borderRadius: 20,
        alignSelf: 'center',
        width: width > 550 ? '75%' : '85%',
        height: width > 550 ? 445 : 390
    },
    modal2Container: {
        backgroundColor: Colors.subTheme,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: width > 550 ? verticalScale(30) : 35
    },
    modal3Container: {
        backgroundColor: Colors.subTheme,
        borderRadius: 20,
        alignSelf: 'center',
        width: width > 550 ? '65%' : '85%',
        height: width > 550 ? 175 : 150
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
    }
});

export default HabitOptionsScreen;