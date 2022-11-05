import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { checkMonthLayout, getMonthName } from '../utils/Weekdays';
import { getStreak } from '../utils/Statistics';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';
import { useDispatch, useSelector } from 'react-redux';

import { markHabitCompleted, markHabitUncompleted, sortHabitCompletion } from '../store/habitSlice';

import { AntDesign } from '@expo/vector-icons';

const CalendarDetails = ({ habit }) => {
    const [referenceDate, setReferenceDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState();
    const [calendarHeight, setCalendarHeight] = useState(width > 550 ? 380 : 340);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [weekdayArray, setWeekdayArray] = useState([]);
    const [textColorArray, setTextColorArray] = useState([]);

    const startingWeekday = useSelector(state => state.settings.startingWeekday);
    const accentColor = useSelector(state => state.settings.accentColor);

    const dispatch = useDispatch();

    useEffect(() => {
        // create a list of dates for the current month
        setCalendarDays(checkMonthLayout(referenceDate));
    }, [referenceDate]);

    useEffect(() => {
        // update the habit's current completion streak every time the habit is modified
        setCurrentStreak(getStreak(habit, 'Current', startingWeekday));
    }, [habit]);

    useEffect(() => {
        // update order of weekdays displayed at top of calendar and adjust text colors to match assigned position of weekends
        if (startingWeekday === 'Sun') { 
            setWeekdayArray(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
            setTextColorArray([true, false, false, false, false, false, true]);
        }
        else if (startingWeekday === 'Mon') { 
            setWeekdayArray(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
            setTextColorArray([false, false, false, false, false, true, true]);
        }
        else if (startingWeekday === 'Tue') { 
            setWeekdayArray(['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']); 
            setTextColorArray([false, false, false, false, true, true, false]);
        }
        else if (startingWeekday === 'Wed') { 
            setWeekdayArray(['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']);
            setTextColorArray([false, false, false, true, true, false, false]);
        }
        else if (startingWeekday === 'Thu') { 
            setWeekdayArray(['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']);
            setTextColorArray([false, false, true, true, false, false, false]);
        }
        else if (startingWeekday === 'Fri') { 
            setWeekdayArray(['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']);
            setTextColorArray([false, true, true, false, false, false, false]);
        }
        else if (startingWeekday === 'Sat') { 
            setWeekdayArray(['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
            setTextColorArray([true, true, false, false, false, false, false]);
        }
    }, [startingWeekday]);

    // update referenceDate to first day of previous month
    const onTapLeft = () => {
        // if current month is January, decrease the year by 1 & set month of reference date to December
        if (referenceDate.getMonth() === 0) {
            setReferenceDate(new Date(String((referenceDate.getFullYear() - 1)) + '/12/01'));
        } else {
            setReferenceDate(new Date(String(referenceDate.getFullYear()) + '/' + String(referenceDate.getMonth()) + '/01'));
        }
    };

    // update referenceDate to first day of next month
    const onTapRight = () => {
        // if current month is December, increase the year by 1 & set month of reference date to January
        if (referenceDate.getMonth() === 11) {
            setReferenceDate(new Date(String((referenceDate.getFullYear() + 1)) + '/01/01'));
        } else {
            setReferenceDate(new Date(String(referenceDate.getFullYear()) + '/' + String(referenceDate.getMonth() + 2) + '/01'));
        }
    };

    const checkIfToday = (date) => {
        let today = new Date();
        if (date.getFullYear() === today.getFullYear()) {
            if (date.getMonth() === today.getMonth()) {
                if (date.getDate() === today.getDate()) { return true; }
            }
        }
        return false;
    };

    const checkIfFuture = (date) => {
        let today = new Date();
        if (date.getFullYear() > today.getFullYear()) {
            return true;
        } else if (date.getFullYear() === today.getFullYear()) {
            if (date.getMonth() > today.getMonth()) {
                return true;
            } else if (date.getMonth() === today.getMonth()) {
                if (date.getDate() > today.getDate()) {
                    return true;
                }
            }
        }
        return false;
    };

    const checkChanges = (type, date) => {
        let updatedChange;
        let changes;
        if (type === 'frequency') {
            updatedChange = habit.frequency;
            changes = habit.changes.frequencies;
        } else if (type === 'goal') {
            updatedChange = habit.goal;
            changes = habit.changes.goals;
        }

        if (changes.length > 0) {
            let index;
            for (let i = 0; i < changes.length; i++) {
                
                let changeDate = new Date(changes[i].date);
                if (date.getFullYear() === changeDate.getFullYear()) {
                    if (date.getMonth() === changeDate.getMonth()) {
                        if (date.getDate() < changeDate.getDate()) {
                            index = i;
                            break;
                        }
                    } else if (date.getMonth() < changeDate.getMonth()) {
                        index = i;
                        break;
                    }
                } else if (date.getFullYear() < changeDate.getFullYear()) {
                    index = i;
                    break;
                }
            }

            if (index >= 0) {
                updatedChange = changes[index].change;
            }
        }
        return updatedChange;
    };

    // types: completed, partial, missed, in-progress, disabled, inactive
    const checkCircleType = (date) => {
        // start by checking if the habit is active on the selected date using its start & end dates
        let startDate = new Date(habit.startDate);
        if (date.getFullYear() < startDate.getFullYear()) {
            return 'inactive';
        } else if (date.getFullYear() === startDate.getFullYear()) {
            if (date.getMonth() < startDate.getMonth()) {
                return 'inactive';
            } else if (date.getMonth() === startDate.getMonth()) {
                if (date.getDate() < startDate.getDate()) {
                    return 'inactive';
                }
            }
        }

        if (habit.endDate != null) {
            let endDate = new Date(habit.endDate);
            if (date.getFullYear() > endDate.getFullYear()) {
                return 'inactive';
            } else if (date.getFullYear() === endDate.getFullYear()) {
                if (date.getMonth() > endDate.getMonth()) {
                    return 'inactive';
                } else if (date.getMonth() === endDate.getMonth()) {
                    if (date.getDate() >= endDate.getDate()) {
                        return 'inactive';
                    }
                }
            }
        }

        // check if the selected date is after today
        let isFuture = checkIfFuture(date);
        if (isFuture === true) { return 'inactive'; }

        // check habit completions
        let completion = habit.completion;
        for (let x = 0; x < completion.years.length; x++) {
            if (date.getFullYear() == completion.years[x].year) {
                for (let y = 0; y < completion.years[x].months.length; y++) {
                    if ((date.getMonth() + 1) == completion.years[x].months[y].month) {
                        // check if there are any days yet completed for this month
                        if (completion.years[x].months[y].days.length > 0) {
                            for (let z = 0; z < completion.years[x].months[y].days.length; z++) {
                                if (date.getDate() == completion.years[x].months[y].days[z].date) {
                                    if (completion.years[x].months[y].days[z].type === 'Completed') { return 'completed'; }
                                    else if (completion.years[x].months[y].days[z].type === 'Partial') { return 'partial'; }
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
                break;
            }   
        }

        // check if it's today's date
        let isToday = checkIfToday(date);

        // need to check the current frequency based on date to know if the date has been missed or is disabled/unscheduled
        let currentFrequency = checkChanges('frequency', date);
        if (currentFrequency.type === 'Days_of_week') {
            for (let i = 0; i < currentFrequency.weekdays.length; i++) {
                if (currentFrequency.weekdays[i] == date.toDateString().slice(0, 3)) { 
                    if (isToday) { return 'in-progress'; }
                    else { return 'missed'; }
                }
                else if (i === (currentFrequency.weekdays.length - 1)) { return 'disabled'; }
            }
        } else if (currentFrequency.type === 'Days_of_month') {
            for (let i = 0; i < currentFrequency.calendarDays.length; i++) {
                if (currentFrequency.calendarDays[i] == date.getDate()) { 
                    if (isToday) { return 'in-progress'; }
                    else { return 'missed'; }
                }
                else if (i === (currentFrequency.calendarDays.length - 1)) { return 'disabled'; }
            }
        } else if (currentFrequency.type === 'Repeat') {
            let numDays = 0;
            date.setHours(0,0,0,0);
            if (habit.changes.frequencies.length > 0) {
                let frequencyIndex;
                for (let i = 0; i < habit.changes.frequencies.length; i++) {
                    let changeDate = new Date(habit.changes.frequencies[i].date);
                    if (date.getFullYear() === changeDate.getFullYear()) {
                        if (date.getMonth() === changeDate.getMonth()) {
                            if (date.getDate() >= changeDate.getDate()) { frequencyIndex = i; }
                        } else if (date.getMonth() > changeDate.getMonth()) { frequencyIndex = i; }
                    } else if (date.getFullYear() > changeDate.getFullYear()) { frequencyIndex = i; }
                }

                if (frequencyIndex >= 0) {
                    numDays = date.getTime() - new Date(habit.changes.frequencies[frequencyIndex].date).getTime();
                } else {
                    numDays = date.getTime() - new Date(habit.startDate).getTime();
                }
            } else {
                numDays = date.getTime() - new Date(habit.startDate).getTime();
            }
            numDays = Math.round(numDays / (1000 * 3600 * 24));

            if (numDays % parseInt(currentFrequency.repetition) == 0) { 
                if (isToday) { return 'in-progress'; }
                else { return 'missed'; }
            }
            else { return 'disabled'; }
        } else if (currentFrequency.type === 'X_days') {
            return 'in-progress';
        }
    };

    // declare what tapping the circle should do based on its type
    const circleActions = (type, date) => {
        let selectedDay = {
            weekday: date.toDateString().slice(0, 3),
            day: date.getDate(),
            month: date.toDateString().slice(4, 7),
            monthNumber: date.getMonth(),
            year: date.getFullYear()
        };

        if (type === 'in-progress' || type === 'missed' || type === 'partial') {
            let currentGoal = checkChanges('goal', date);
            dispatch(markHabitCompleted({habitId: habit.id, dayType: 'Completed', goal: currentGoal, date: selectedDay}));
            dispatch(sortHabitCompletion({habitId: habit.id}));
        } else if (type === 'completed') {
            dispatch(markHabitUncompleted({habitId: habit.id, date: selectedDay}));
        }
    };

    const WeekdayCircle = (date) => {
        let type;
        if (date != null) {
            type = checkCircleType(date);
        }

        let color1;
        let color2;
        if (type === 'inactive') { color1 = Colors.subTheme, color2 = Colors.subTheme }
        else if (type === 'disabled') { color1 = Colors.lightTheme, color2 = Colors.lightTheme }
        else if (type === 'partial') { color1 = '#806600', color2 = '#f4b842' }
        else if (type === 'completed') { color1 = '#004d32', color2 = '#43a964' }
        else if (type === 'missed') { color1 = '#800000', color2 = '#ff3333' }
        else if (type === 'in-progress') { color1 = '#395379', color2 = '#a8a8a8' }

        if (date === null) {
            return (
                <View style={[styles.numberCircle, { borderWidth: 0 }]}/>
            );
        } else {
            return (
                <View>
                    {type != 'disabled' && type != 'inactive' ? <TouchableOpacity
                        style={[styles.numberCircle, { backgroundColor: color1, borderColor: color2 }]}
                        onPress={() => circleActions(type, date)}
                    >
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 18 : 16 }}>{date.getDate()}</Text>
                    </TouchableOpacity> : null}
                    {type === 'disabled' || type === 'inactive' ? <TouchableWithoutFeedback>
                        <View style={[styles.numberCircle, { backgroundColor: color1, borderColor: color2 }]}>
                            <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 18 : 16 }}>{date.getDate()}</Text>
                        </View>
                    </TouchableWithoutFeedback> : null}
                </View>
            );
        }
    };

    const WeekLayout = (weekArray) => {
        let weekOrder = [];

        if (weekArray.length < 7) {
            if (weekArray.length > 0) {
                if (weekArray[0].getDate() === calendarDays[0].getDate()) {
                    for (let i = 0; i < (7 - weekArray.length); i++) { weekOrder.push(null); }
                    for (let i = 0; i < weekArray.length; i++) { weekOrder.push(weekArray[i]); }
                } else {
                    for (let i = 0; i < weekArray.length; i++) { weekOrder.push(weekArray[i]); }
                    for (let i = 0; i < (7 - weekArray.length); i++) { weekOrder.push(null); }
                }
            } else {
                for (let i = 0; i < 7; i++) { weekOrder.push(null); }
            }
        } else {
            weekOrder = weekArray;
        }

        return (
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center', marginHorizontal: width > 550 ? 12 : 5 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    {WeekdayCircle(weekOrder[0])}
                    {WeekdayCircle(weekOrder[1])}
                    {WeekdayCircle(weekOrder[2])}
                </View>
                {WeekdayCircle(weekOrder[3])}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    {WeekdayCircle(weekOrder[4])}
                    {WeekdayCircle(weekOrder[5])}
                    {WeekdayCircle(weekOrder[6])}
                </View>
            </View>
        );
    };

    const MonthLayout = () => {
        let numDays = calendarDays.slice(-1)[0].getDate();
        
        // alter the number of days in the first week based on the starting weekday vs weekday of first day of the month
        let startWeekDays;
        let index1;
        let index2 = calendarDays[0].getDay();  // Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
        if (startingWeekday === 'Sun') { index1 = 0; }
        else if (startingWeekday === 'Mon') { index1 = 1; }
        else if (startingWeekday === 'Tue') { index1 = 2; }
        else if (startingWeekday === 'Wed') { index1 = 3; }
        else if (startingWeekday === 'Thu') { index1 = 4; }
        else if (startingWeekday === 'Fri') { index1 = 5; }
        else if (startingWeekday === 'Sat') { index1 = 6; }

        if (index1 === index2) {
            startWeekDays = 7;
        } else if (index1 > index2) {
            startWeekDays = index1 - index2;
        } else if (index1 < index2) {
            startWeekDays = 7 - index2 + index1;
        }

        let week1 = [], week2 = [], week3 = [], week4 = [], week5 = [], week6 = [];

        for (let i = 0; i < 6; i++) {
            if (i === 0) {
                week1 = calendarDays.slice(0, startWeekDays);
                continue;
            } else if (i === 1) { week2 = calendarDays.slice(startWeekDays, startWeekDays + 7); }
            else if (i === 2) { week3 = calendarDays.slice(startWeekDays, startWeekDays + 7); }
            else if (i === 3) { week4 = calendarDays.slice(startWeekDays, startWeekDays + 7); }
            else {
                if (numDays > 0) {
                    if (i === 4) {
                        if (numDays > 7) { week5 = calendarDays.slice(startWeekDays, startWeekDays + 7); }
                        else {
                            week5 = calendarDays.slice(startWeekDays, numDays);
                            break;
                        }
                    } else if (i === 5) { week6 = calendarDays.slice(startWeekDays, numDays); }
                }
            }
            startWeekDays += 7;
        }

        if (week6.length > 0) { 
            if (width > 550) {
                if (calendarHeight === 380) { setCalendarHeight(430); }
            } else {
                if (calendarHeight === 340) { setCalendarHeight(385); }
            }
        } else {
            if (width > 550) {
                if (calendarHeight === 430) { setCalendarHeight(380); }
            } else {
                if (calendarHeight === 385) { setCalendarHeight(340); }
            }
        }

        return (
            <View style={{ flex: 1 }}>
                {WeekLayout(week1)}
                {WeekLayout(week2)}
                {WeekLayout(week3)}
                {WeekLayout(week4)}
                {WeekLayout(week5)}
                {WeekLayout(week6)}
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <View style={[styles.calendarContainer, { height: calendarHeight }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center' }}
                            onPress={() => onTapLeft()}
                        >
                            <View style={{ left: '45%' }}>
                                <AntDesign name='caretleft' size={width > 550 ? 29 : 25} color='white' style={{ left: 1, top: 1 }}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: width > 550 ? 105 : 90 }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 21 : 18, marginBottom: 2, textAlign: 'center' }}>{getMonthName(referenceDate)}</Text>
                        <Text style={{ color: '#999999', fontSize: width > 550 ? 19 : 16, textAlign: 'center' }}>{referenceDate.getFullYear()}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
                            onPress={() => onTapRight()}
                        >
                            <View style={{ right: '45%' }}>
                                <AntDesign name='caretright' size={width > 550 ? 29 : 25} color='white' style={{ left: 1, top: 1 }}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={styles.weekdayTextContainer}>
                    <View style={styles.individualTextContainer}>
                        <Text style={{ color: textColorArray[0] === true ? accentColor : Colors.lightGrey, fontSize: width > 550 ? 16 : 14 }}>{weekdayArray[0]}</Text>
                    </View>
                    <View style={styles.individualTextContainer}>
                        <Text style={{ color: textColorArray[1] === true ? accentColor : Colors.lightGrey, fontSize: width > 550 ? 16 : 14 }}>{weekdayArray[1]}</Text>
                    </View>
                    <View style={styles.individualTextContainer}>
                        <Text style={{ color: textColorArray[2] === true ? accentColor : Colors.lightGrey, fontSize: width > 550 ? 16 : 14 }}>{weekdayArray[2]}</Text>
                    </View>
                    <View style={styles.individualTextContainer}>
                        <Text style={{ color: textColorArray[3] === true ? accentColor : Colors.lightGrey, fontSize: width > 550 ? 16 : 14 }}>{weekdayArray[3]}</Text>
                    </View>
                    <View style={styles.individualTextContainer}>
                        <Text style={{ color: textColorArray[4] === true ? accentColor : Colors.lightGrey, fontSize: width > 550 ? 16 : 14 }}>{weekdayArray[4]}</Text>
                    </View>
                    <View style={styles.individualTextContainer}>
                        <Text style={{ color: textColorArray[5] === true ? accentColor : Colors.lightGrey, fontSize: width > 550 ? 16 : 14 }}>{weekdayArray[5]}</Text>
                    </View>
                    <View style={styles.individualTextContainer}>
                        <Text style={{ color: textColorArray[6] === true ? accentColor : Colors.lightGrey, fontSize: width > 550 ? 16 : 14 }}>{weekdayArray[6]}</Text>
                    </View>
                </View>

                {calendarDays   // wait for calendar days to finish generating
                    ? <View style={{ flex: 1 }}>
                        {MonthLayout()}
                    </View>
                    : null
                }
            </View>

            <View style={styles.streakContainer}>
                <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 21 : 18 }}>Streak</Text>
                <Text style={{ color: accentColor, fontWeight: 'bold', fontSize: width > 550 ? 22 : 20 }}>{currentStreak} DAYS</Text>
            </View>

            <View style={[styles.streakContainer, { height: 140, justifyContent: 'flex-start', paddingTop: 10, paddingHorizontal: 20 }]}>
                <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 21 : 18, marginBottom: 5 }}>Notes</Text>
                <View style={{ flex: 1, marginBottom: 15, justifyContent: 'center' }}>
                    {habit.notes.length === 0
                        ? <Text style={{ color: 'white', fontSize: width > 550 ? 19 : 16, bottom: 5 }}>No notes for this habit</Text>
                        : <Text style={{ color: Colors.lightGrey, fontSize: width > 550 ? 19 : 16, textAlign: 'center' }}>{habit.notes}</Text>
                    }
                </View>
            </View>
            <View style={{ height: 20 }}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    calendarContainer: {
        width: width > 550 ? '85%' : '90%',
        backgroundColor: Colors.subTheme,
        marginTop: 15,
        borderRadius: 15,
        paddingTop: 10
    },
    streakContainer: {
        width: width > 550 ? '85%' : '90%',
        height: 85,
        backgroundColor: Colors.subTheme,
        marginTop: 15,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    leftWeekdaysLayout: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingLeft: width > 550 ? '3%' : '1%',
        paddingRight: width > 550 ? '0.5%' : '1%'
    },
    rightWeekdaysLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: width > 550 ? '16%' : '11.5%',
        paddingRight: width > 550 ? '19.5%' : '13.5%'
    },
    numberCircle: {
        height: width > 550 ? 41 : 36,
        width: width > 550 ? 41 : 36,
        borderRadius: width > 550 ? 18 : 16,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    weekdayTextContainer: {
        marginTop: 15,
        marginBottom: 3,
        flexDirection: 'row',
        width: width > 550 ? '85%' : '92%',
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    individualTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width > 550 ? 41 : 36
    }
});

export default CalendarDetails;