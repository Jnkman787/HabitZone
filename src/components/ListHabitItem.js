import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { getWeekday } from '../utils/Weekdays';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';
import { useDispatch } from 'react-redux';

import { markHabitCompleted, markHabitUncompleted, sortHabitCompletion } from '../store/habitSlice';

// icons
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomIcon from '../utils/CustomIcon';

const getCategoryIcon = (category) => {
    let icon;

    if (category === 'Quit') {
        icon = <MaterialIcons name='do-not-disturb' size={32} color='white'/>
    } else if (category === 'Sports') {
        icon = <Ionicons name='basketball' size={32} color='white'/>
    } else if (category === 'Study') {
        icon = <Ionicons name='school' size={29} color='white'/>
    } else if (category === 'Work') {
        icon = <MaterialIcons name='work' size={28} color='white'/>
    } else if (category === 'Nutrition') {
        icon = <Ionicons name='nutrition' size={29} color='white'/>
    } else if (category === 'Home') {
        icon = <Ionicons name='home' size={27} color='white'/>
    } else if (category === 'Outdoor') {
        icon = <Entypo name='tree' size={27} color='white' />
    } else if (category === 'Social') {
        icon = <MaterialCommunityIcons name='message-text' size={27} color='white'/>
    } else if (category === 'Art') {
        icon = <Ionicons name='color-palette' size={30} color='white'/>
    } else if (category === 'Finance') {
        icon = <CustomIcon name='coin2' size={28} color='white'/>
    } else if (category === 'Other') {
        icon = <MaterialCommunityIcons name='dots-horizontal-circle' size={32} color='white'/>
    } else if (category === 'Travel') {
        icon = <Ionicons name='airplane' size={29} color='white'/>
    } else if (category === 'Health') {
        icon = <MaterialCommunityIcons name='gamepad-round' size={32} color='white'/>
    } else if (category === 'Leisure') {
        icon = <Ionicons name='happy' size={31} color='white'/>
    } else if (category === 'Pets') {
        icon = <Ionicons name='paw' size={29} color='white'/>
    }

    return icon;
};

const ListHabitItem = ({ navigation, habit, week, finalItem }) => {
    const [habitTitle, setHabitTitle] = useState();
    const [frequencyText, setFrequencyText] = useState();
    const [habitType, setHabitType] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        // set the habit type based on the end date
        let today = new Date();
        today.setHours(0,0,0,0);
        let endDate = new Date(habit.item.endDate);

        if (habit.item.endDate != null) {
            if (today >= endDate) { setHabitType('Ended'); }
            else { setHabitType('Active'); }
        } else { setHabitType('Active'); }
    }, []);

    useEffect(() => {
        checkGoalType();
        checkFrequencyType();
    }, [habit]);

    useEffect(() => {
        if (habitTitle != null) {
            checkHabitTitle();
        }
    }, [habitTitle]);

    const checkIfToday = (date) => {
        let today = new Date();
        if (date.getFullYear() === today.getFullYear()) {
            if (date.getMonth() === today.getMonth()) {
                if (date.getDate() === today.getDate()) { return true; }
            }
        }
        return false;
    };

    const checkChanges = (type, date) => {
        let updatedChange;
        let changes;
        if (type === 'frequency') {
            updatedChange = habit.item.frequency;
            changes = habit.item.changes.frequencies;
        } else if (type === 'goal') {
            updatedChange = habit.item.goal;
            changes = habit.item.changes.goals;
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
        // start by checking if the habit has started yet
        let startDate = new Date(habit.item.startDate);

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

        // check habit completions
        let completion = habit.item.completion;
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
            if (habit.item.changes.frequencies.length > 0) {
                let frequencyIndex;
                for (let i = 0; i < habit.item.changes.frequencies.length; i++) {
                    let changeDate = new Date(habit.item.changes.frequencies[i].date);
                    if (date.getFullYear() === changeDate.getFullYear()) {
                        if (date.getMonth() === changeDate.getMonth()) {
                            if (date.getDate() >= changeDate.getDate()) { frequencyIndex = i; }
                        } else if (date.getMonth() > changeDate.getMonth()) { frequencyIndex = i; }
                    } else if (date.getFullYear() > changeDate.getFullYear()) { frequencyIndex = i; }
                }

                if (frequencyIndex >= 0) {
                    numDays = date.getTime() - new Date(habit.item.changes.frequencies[frequencyIndex].date).getTime();
                } else {
                    numDays = date.getTime() - new Date(habit.item.startDate).getTime();
                }
            } else {
                numDays = date.getTime() - new Date(habit.item.startDate).getTime();
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
            dispatch(markHabitCompleted({habitId: habit.item.id, dayType: 'Completed', goal: currentGoal, date: selectedDay}));
            dispatch(sortHabitCompletion({habitId: habit.item.id}));
        } else if (type === 'completed') {
            dispatch(markHabitUncompleted({habitId: habit.item.id, date: selectedDay}));
        }
    };

    const checkHabitTitle = () => {
        if (width < 550) {
            if (Platform.OS === 'ios') {
                if (habitTitle.length > 34) {
                    setHabitTitle(habitTitle.slice(0, 32) + ' ...');
                }
            } else {
                if (habitTitle.length > 32) {
                    setHabitTitle(habitTitle.slice(0, 30) + ' ...');
                }
            }
        }
    };

    const checkGoalType = () => {
        if (habit.item.goal.type === 'Off') {
            setHabitTitle(habit.item.name);
        } else if (habit.item.goal.type === 'Amount') {
            setHabitTitle(habit.item.name + ' ' + habit.item.goal.target + ' ' + habit.item.goal.unit);
        } else if (habit.item.goal.type === 'Duration') {
            if (habit.item.goal.hours > 0) {
                if (habit.item.goal.minutes > 0) {
                    setHabitTitle(habit.item.name + ' for ' + habit.item.goal.hours + 'h ' + habit.item.goal.minutes + 'min');
                } else if (habit.item.goal.hours == 1) {
                    setHabitTitle(habit.item.name + ' for 1 hour');
                } else {
                    setHabitTitle(habit.item.name + ' for ' + habit.item.goal.hours + ' hours');
                }
            } else {
                if (habit.item.goal.minutes == 1) {
                    setHabitTitle(habit.item.name + ' for 1 minute');
                } else {
                    setHabitTitle(habit.item.name + ' for ' + habit.item.goal.minutes + ' minutes');
                }
            }
        } else if (habit.item.goal.type === 'Checklist') {
            if (habit.item.goal.subtasks.length == 1) {
                setHabitTitle(habit.item.name + ' (1 subtask)');
            } else {
                setHabitTitle(habit.item.name + ' (' + habit.item.goal.subtasks.length + ' subtasks)');
            }
        }
    };

    const checkFrequencyType = () => {
        if (habit.item.frequency.type === 'Days_of_week') {
            if (habit.item.frequency.weekdays.length === 7) {
                setFrequencyText('Every day');
            } else {
                setFrequencyText('Fixed days');
            }
        } else if (habit.item.frequency.type === 'Days_of_month') {
            if (habit.item.frequency.calendarDays.length > 6) {
                setFrequencyText('Fixed days');
            } else {
                let days = habit.item.frequency.calendarDays;
                let daysText = '';
                for (let i = 0; i < days.length; i++) {
                    if (days[i] === days[days.length - 1]) {
                        daysText = daysText.concat(days[i]);
                    } else {
                        daysText = daysText.concat(days[i], ', ');
                    }
                }
                setFrequencyText('Fixed days: ' + daysText);
            }
        } else if (habit.item.frequency.type === 'Repeat') {
            setFrequencyText('Every ' + habit.item.frequency.repetition + ' days');
        } else if (habit.item.frequency.type === 'X_days') {
            if (habit.item.frequency.interval === 'Week') {
                if (habit.item.frequency.number > 1) {
                    setFrequencyText(habit.item.frequency.number + ' days per week');
                } else {
                    setFrequencyText(habit.item.frequency.number + ' day per week');
                }
            } else {
                if (habit.item.frequency.number > 1) {
                    setFrequencyText(habit.item.frequency.number + ' days per month');
                } else {
                    setFrequencyText(habit.item.frequency.number + ' day per month');
                }
            }
        }
    };

    // create a function for getting the correct circle color based on frequency & completion
    const WeekdayCircle = (date) => {
        let weekday = getWeekday(date);

        // use type to assign style and onPress actions
        let type = checkCircleType(date);

        let color1;
        let color2;
        if (type === 'inactive') { color1 = Colors.subTheme, color2 = Colors.subTheme }
        else if (type === 'disabled') { color1 = Colors.lightTheme, color2 = Colors.lightTheme }
        else if (type === 'partial') { color1 = '#806600', color2 = '#f4b842' }
        else if (type === 'completed') { color1 = '#004d32', color2 = '#43a964' }
        else if (type === 'missed') { color1 = '#800000', color2 = '#ff3333' }
        else if (type === 'in-progress') { color1 = '#395379', color2 = '#a8a8a8' }

        return (
            <View style={{ marginTop: 10, alignItems: 'center', marginHorizontal: width > 550 ? 12 : 5 }}>
                <Text style={{ color: Colors.lightGrey, marginBottom: 3, fontSize: width > 550 ? 16 : 14 }}>{weekday}</Text>
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
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => navigation.navigate('DetailsStack', { screen: 'HabitDetails', params: { selectedHabit: habit.item } })}  // send user to habit detail screen
        >
            <View style={[styles.habitContainer, { marginBottom: habit.item.id === finalItem.id ? 15 : 0,
                height: habitType != 'Ended' ? width > 550 ? 158 : 133 : width > 550 ? 95 : 80
            }]}>
                <View style={[styles.headingContainer, { marginTop: habitType === 'Active' ? width > 550 ? 17 : 13 : width > 550 ? 22 : 18 }]}>
                    <View style={{ backgroundColor: habit.item.color, width: width > 550 ? 8 : 5, borderRadius: 5, marginRight: 10 }}/>
                    <View>
                        <Text style={styles.habitTitle}>{habitTitle}</Text>
                        <Text style={styles.habitFrequency}>{frequencyText}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <View style={[styles.iconCircle, { backgroundColor: habit.item.color }]}>
                            {getCategoryIcon(habit.item.category)}
                        </View>
                    </View>
                </View>

                {/* wait for week array to get a value before trying to use it */}
                {habitType === 'Ended' ? null : !week ? null :
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        {WeekdayCircle(week[0])}
                        {WeekdayCircle(week[1])}
                        {WeekdayCircle(week[2])}
                        {WeekdayCircle(week[3])}
                        {WeekdayCircle(week[4])}
                        {WeekdayCircle(week[5])}
                        {WeekdayCircle(week[6])}
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    habitContainer: {
        width: width > 550 ? '85%' : '95%',
        backgroundColor: Colors.subTheme,
        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 20,
        alignItems: 'center'
    },
    headingContainer: {
        flexDirection: 'row',
        height: width > 550 ? 50 : 40,
        marginHorizontal: width > 550 ? 15 : 11
    },
    habitTitle: {
        color: 'white',
        fontSize: width > 550 ? 19 : 17,
        fontFamily: 'roboto-medium',
        top: Platform.OS === 'ios' ? 0 : -3
    },
    habitFrequency: {
        color: Colors.lightGrey,
        fontSize: width > 550 ? 17 : 15,
        top: Platform.OS === 'ios' ? 1 : -2
    },
    iconCircle: {
        height: width > 550 ? 45 : 40,
        width: width > 550 ? 45 : 40,
        borderRadius: width > 550 ? 23 : 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    numberCircle: {
        height: width > 550 ? 41 : 36,
        width: width > 550 ? 41 : 36,
        borderRadius: width > 550 ? 18 : 16,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ListHabitItem;