import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { width, scale, verticalScale } from '../utils/Scaling';
import { useSelector } from 'react-redux';
import Colors from '../utils/Colors';
import DatePicker from 'react-native-modern-datepicker'

import CalendarHabitItem from '../components/CalendarHabitItem';
import CustomIcon from '../utils/CustomIcon';
import { Ionicons } from '@expo/vector-icons';

const setupDateForPicker = (date) => {
    let pickerDate;

    if (date.getMonth() < 9) {
        if (date.getDate() < 10) {
            pickerDate = date.getFullYear() + '/0' + (date.getMonth() + 1) + '/0' + date.getDate();
        } else {
            pickerDate = date.getFullYear() + '/0' + (date.getMonth() + 1) + '/' + date.getDate();
        }
    } else if (date.getDate() < 10) {
        pickerDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/0' + date.getDate();
    } else {
        pickerDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    }

    return pickerDate;
};

const CalendarScreen = ({ navigation }) => {
    const habits = useSelector((state) => state.habits.habits);
    const accentColor = useSelector(state => state.settings.accentColor);
    const [selectedDate, setSelectedDate] = useState(setupDateForPicker(new Date()));
    const [listedHabits, setListedHabits] = useState();

    const checkFrequencyChanges = (selectedHabit, date) => {
        let updatedFrequency = selectedHabit.frequency;
        if (selectedHabit.changes.frequencies.length > 0) {
            // find the frequency change closest to the selected day that takes place after
            let frequencyIndex;
            for (let i = 0; i < selectedHabit.changes.frequencies.length; i++) {
                let changeDate = new Date(selectedHabit.changes.frequencies[i].date);
                if (date.getFullYear() === changeDate.getFullYear()) {
                    if (date.getMonth() === changeDate.getMonth()) {
                        if (date.getDate() < changeDate.getDate()) {
                            frequencyIndex = i;
                            break;
                        }
                    } else if (date.getMonth() < changeDate.getMonth()) {
                        frequencyIndex = i;
                        break;
                    }
                } else if (date.getFullYear() < changeDate.getFullYear()) {
                    frequencyIndex = i;
                    break;
                }
            }

            if (frequencyIndex >= 0) {
                updatedFrequency = selectedHabit.changes.frequencies[frequencyIndex].change;
            }
        }
        return updatedFrequency;
    };

    const sortHabitFrequencies = (date) => {
        let habitArray = [];

        // loop through the entire list of habits
        for (let i = 0; i < habits.length; i++) {
            // start by checking if the habit is active using it's start & end dates
            let startDate = new Date(habits[i].startDate);
            if (date.getFullYear() < startDate.getFullYear()) {
                continue;
            } else if (date.getFullYear() === startDate.getFullYear()) {
                if (date.getMonth() < startDate.getMonth()) {
                    continue;
                } else if (date.getMonth() === startDate.getMonth()) {
                    if (date.getDate() < startDate.getDate()) {
                        continue;
                    }
                }
            }

            if (habits[i].endDate != null) {
                let endDate = new Date(habits[i].endDate);
                if (date.getFullYear() > endDate.getFullYear()) {
                    continue;
                } else if (date.getFullYear() === endDate.getFullYear()) {
                    if (date.getMonth() > endDate.getMonth()) {
                        continue;
                    } else if (date.getMonth() === endDate.getMonth()) {
                        if (date.getDate() >= endDate.getDate()) {
                            continue;
                        }
                    }
                }
            }

            // check the type of frequenncy based on frequency changes
            let currentFrequency = checkFrequencyChanges(habits[i], date);

            // based on the type of frequency, call upon a specific function
            if (currentFrequency.type === 'Days_of_week') {
                if (checkWeekdays(currentFrequency, date) == true) {
                    habitArray.push(habits[i]);
                }
            } else if (currentFrequency.type === 'Days_of_month') {
                if (checkCalendarDays(currentFrequency, date) == true) {
                    habitArray.push(habits[i]);
                }
            } else if (currentFrequency.type === 'Repeat') {
                if (checkRepeat(habits[i], currentFrequency, date) == true) {
                    habitArray.push(habits[i]);
                }
            } else if (currentFrequency.type === 'X_days') {
                habitArray.push(habits[i]);
            }
        }

        return habitArray;
    };

    useEffect(() => {
        let dateTitle = new Date(selectedDate).toDateString().slice(4, 7) + '. ' + new Date(selectedDate).getDate() + ', ' + new Date(selectedDate).getFullYear();
        
        navigation.setOptions({
            headerRight: () => {
                return (
                    <Text style={[styles.headerStyle, { right: 25 }]}>{dateTitle}</Text>
                );
            }
        });

        // update list of displayed habits each time the user selects a different date
        let habitArray = sortHabitFrequencies(new Date(selectedDate));
        setListedHabits(habitArray);
    }, [selectedDate, habits]);

    const formatSelectedDay = (date) => {
        let selectedDayFormat;
        if ((date.getMonth() + 1) < 10) {
            if (date.getDate() < 10) {
                selectedDayFormat = String(date.getFullYear()) + '/0' + String(date.getMonth() + 1) + '/0' + String(date.getDate());
            } else {
                selectedDayFormat = String(date.getFullYear()) + '/0' + String(date.getMonth() + 1) + '/' + String(date.getDate());
            }
        } else {
            if (date.getDate() < 10) {
                selectedDayFormat = String(date.getFullYear()) + '/' + String(date.getMonth() + 1) + '/0' + String(date.getDate());
            } else {
                selectedDayFormat = String(date.getFullYear()) + '/' + String(date.getMonth() + 1) + '/' + String(date.getDate());
            }
        }
        return selectedDayFormat;
    };

    const checkWeekdays = (currentFrequency, date) => {
        for (let i = 0; i < currentFrequency.weekdays.length; i++) {
            if (currentFrequency.weekdays[i] == date.toDateString().slice(0, 3)) {
                return true;
            }
        }
        return false;
    };

    const checkCalendarDays = (currentFrequency, date) => {
        for (let i = 0; i < currentFrequency.calendarDays.length; i++) {
            if (currentFrequency.calendarDays[i] == date.getDate()) {
                return true;
            }
        }
        return false;
    };

    const checkRepeat = (selectedHabit, currentFrequency, date) => {
        let numDays = 0;
        // start by checking if the habit has any frequency changes
        if (selectedHabit.changes.frequencies.length > 0) {
            // find the date of the frequency change closest to before the selected day
            let frequencyIndex;
            for (let i = 0; i < selectedHabit.changes.frequencies.length; i++) {
                let changeDate = new Date(selectedHabit.changes.frequencies[i].date);
                if (date.getFullYear() === changeDate.getFullYear()) {
                    if (date.getMonth() === changeDate.getMonth()) {
                        if (date.getDate() >= changeDate.getDate()) { frequencyIndex = i; }
                    } else if (date.getMonth() > changeDate.getMonth()) { frequencyIndex = i }
                } else if (date.getFullYear() > changeDate.getFullYear()) { frequencyIndex = i; }
            }
            
            if (frequencyIndex >= 0) {
                numDays = new Date(formatSelectedDay(date)).getTime() - new Date(selectedHabit.changes.frequencies[frequencyIndex].date).getTime();
            } else {
                numDays = new Date(formatSelectedDay(date)).getTime() - new Date(selectedHabit.startDate).getTime();
            }
        } else {
            // get the time difference between the selected day and the start date
            numDays = new Date(formatSelectedDay(date)).getTime() - new Date(selectedHabit.startDate).getTime();
        }

        // calculate the # of days between the two dates
        numDays = Math.round(numDays / (1000 * 3600 * 24));
        
        if (numDays % parseInt(currentFrequency.repetition) == 0) {
            return true;
        } else { return false; }
    };

    const setDate = (date) => {
        if (date === selectedDate) { return; } 
        else { setSelectedDate(date); }
    };

    return (
        <View style={styles.screen}>
            {/* wait for listed habits to get a value before trying to list them */}
            {listedHabits ? listedHabits.length >= 1 ? <View style={{ width: width > 550 ? '75%' : '90%', position: 'absolute', height: '100%', alignSelf: 'center' }}>
                <View style={{ flex: 1 }}/>
                <View style={{ flex: 1, width: 1, backgroundColor: 'white', marginLeft: width > 550 ? 22 : 19 }}/>
            </View> : null : null}
            {listedHabits ? <FlatList
                ListHeaderComponent={
                    <View>
                        <DatePicker
                            mode='calendar'
                            onSelectedChange={date => setDate(date)}
                            selected={selectedDate}
                            current={selectedDate}
                            options={{
                                backgroundColor: Colors.subTheme,
                                textHeaderColor: 'white',
                                textDefaultColor: 'white',
                                textSecondaryColor: 'white',
                                selectedTextColor: 'white',
                                mainColor: accentColor,
                                borderColor: Colors.lightGrey
                            }}
                        />
                        <View style={{ height: 2, backgroundColor: Colors.lightTheme }}/>
                    </View>
                }
                data={listedHabits}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Image
                            source={require('../assets/images/empty_box.png')}
                            style={{ height: 80, width: 80, marginBottom: 20 }}
                        />
                        <Text style={styles.text}>No habits scheduled</Text>
                        <Text style={styles.text}>on this date</Text>
                    </View>
                }
                renderItem={habitData =>
                    <CalendarHabitItem
                        navigation={navigation}
                        habit={habitData}
                        selectedDay={selectedDate}
                    />
                }
                ListFooterComponent={
                    listedHabits.length >= 1 ?
                        <View style={{ width: width > 550 ? '75%' : '90%', alignSelf: 'center',
                                height: listedHabits.length > 2 ? 20 : listedHabits.length > 1 ? width > 550 ? 20 : verticalScale(40) : width > 550 ? 95 : verticalScale(140) 
                            }}>
                            <View style={{ flex: 1, width: 1, backgroundColor: 'white', marginLeft: width > 550 ? 22 : 19 }}/>
                        </View> : null
                }
            /> : null}
        </View>
    );
};

CalendarScreen.navigationOptions = ({ route }) => {
    const { headerRight } = route.params;

    return {
        title: null,
        headerLeft: () => (
            <Text style={[styles.headerStyle, { left: 25 }]}>Calendar</Text>
        ),
        headerRight,
        tabBarIcon: ({ focused }) => {
            if (focused) {
                return (<Ionicons name='calendar' size={29} color='white' style={{ left: width > 550 ? scale(16) : 9 }}/>);
            } else {
                return (<CustomIcon name='calendar-outline' size={27} color='white' style={{ left: width > 550 ? scale(16) : 9 }}/>);
            }
        }
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    headerStyle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'roboto-medium',
        top: 2
    },
    text: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17
    }
});

export default CalendarScreen;