import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { width } from '../../utils/Scaling';
import Colors from '../../utils/Colors';
import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import StringInput from '../../components/StringInput';
import TransferOption from '../../components/TransferOption';
import AdvancedOptions from '../../components/AdvancedOptions';

import { addHabitGoalChange, removeHabitGoalChange, addHabitFrequencyChange, removeHabitFrequencyChange, editHabit } from '../../store/habitSlice';
import { setCategory, setGoal, setFrequency, setStartDate, setEndDate, setNotifications } from '../../store/setupSlice';

const EditHabitScreen = ({ navigation, route }) => {
    const { habit } = route.params;
    const [originalGoal] = useState(habit.goal);
    const [originalFrequency] = useState(habit.frequency)

    const scrollViewRef = useRef();
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [name, setName] = useState(habit.name);
    const [notes, setNotes] = useState(habit.notes);

    const category = useSelector(state => state.setup.category);
    const color = useSelector(state => state.setup.color);
    const goal = useSelector(state => state.setup.goal);
    const frequency = useSelector(state => state.setup.frequency);
    const startDate = useSelector(state => state.setup.startDate);
    const endDate = useSelector(state => state.setup.endDate);
    const notifications = useSelector(state => state.setup.notifications);

    const accentColor = useSelector(state => state.settings.accentColor);

    const dispatch = useDispatch();

    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        // set values
        dispatch(setCategory({category: habit.category, color: habit.color}));

        if (habit.goal.type === 'Off') {
            dispatch(setGoal({goalType: habit.goal.type}));
        } else if (habit.goal.type === 'Amount') {
            dispatch(setGoal({goalType: habit.goal.type, target: habit.goal.target, unit: habit.goal.unit}));
        } else if (habit.goal.type === 'Duration') {
            dispatch(setGoal({goalType: habit.goal.type, hours: habit.goal.hours, minutes: habit.goal.minutes}));
        } else if (habit.goal.type === 'Checklist') {
            dispatch(setGoal({goalType: habit.goal.type, newSubtasks: habit.goal.subtasks}));
        }

        if (habit.frequency.type === 'Days_of_week') {
            dispatch(setFrequency({frequencyType: habit.frequency.type, weekdays: habit.frequency.weekdays}));
        } else if (habit.frequency.type === 'Days_of_month') {
            dispatch(setFrequency({frequencyType: habit.frequency.type, calendarDays: habit.frequency.calendarDays}));
        } else if (habit.frequency.type === 'Repeat') {
            dispatch(setFrequency({frequencyType: habit.frequency.type, repetition: habit.frequency.repetition}));
        } else if (habit.frequency.type === 'X_days') {
            dispatch(setFrequency({frequencyType: habit.frequency.type, interval: habit.frequency.interval, number: habit.frequency.number}));
        }

        dispatch(setStartDate(habit.startDate));
        dispatch(setEndDate(habit.endDate));
        dispatch(setNotifications({enabled: habit.notifications.enabled, time: habit.notifications.time}));

        return () => {
            keyboardHideListener.remove();
            keyboardShowListener.remove();
        };
    }, []);

    const setupDateForChange = () => {
        let today = new Date();
        let changeDate;

        if (today.getMonth() < 9) {
            if (today.getDate() < 10) {
                changeDate = today.getFullYear() + '/0' + (today.getMonth() + 1) + '/0' + today.getDate();
            } else {
                changeDate = today.getFullYear() + '/0' + (today.getMonth() + 1) + '/' + today.getDate();
            }
        } else if (today.getDate() < 10) {
            changeDate = today.getFullYear() + '/' + (today.getMonth() + 1) + '/0' + today.getDate();
        } else {
            changeDate = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        }

        return changeDate;
    };

    // save previous goal if changed to a different one
    const checkChangedGoal = () => {
        if (habit.changes.goals.length > 0) {   // check if goal has been changed back to the same value as the most recent change
            if (habit.changes.goals.slice(-1)[0].change.type === goal.type) {
                // check if the most recent change was made today, otherwise don't remove it
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                let changeDate = new Date(habit.changes.goals.slice(-1)[0].date);

                if (changeDate.getFullYear() === today.getFullYear()) {
                    if (changeDate.getMonth() === today.getMonth()) {
                        if (changeDate.getDate() === today.getDate()) {
                            if (goal.type === 'Off') {
                                dispatch(removeHabitGoalChange({habitId: habit.id}));
                                return;
                            } else if (goal.type === 'Amount') {
                                if (goal.target === habit.changes.goals.slice(-1)[0].change.target) {
                                    if (goal.unit === habit.changes.goals.slice(-1)[0].change.unit) {
                                        dispatch(removeHabitGoalChange({habitId: habit.id}));
                                        return;
                                    }
                                }
                            } else if (goal.type === 'Duration') {
                                if (goal.hours === habit.changes.goals.slice(-1)[0].change.hours) {
                                    if (goal.minutes === habit.changes.goals.slice(-1)[0].change.minutes) {
                                        dispatch(removeHabitGoalChange({habitId: habit.id}));
                                        return;
                                    }
                                }
                            } else if (goal.type === 'Checklist') {
                                if (goal.subtasks.length === habit.changes.goals.slice(-1)[0].change.subtasks.length) {
                                    for (let i = 0; i < goal.subtasks.length; i++) {
                                        if (goal.subtasks[i] != habit.changes.goals.slice(-1)[0].change.subtasks[i]) {
                                            break;
                                        } else if (i === (goal.subtasks.length - 1)) {
                                            dispatch(removeHabitGoalChange({habitId: habit.id}));
                                        }
                                    }
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        if (originalGoal.type != goal.type) {   // check for a change in goal type
            dispatch(addHabitGoalChange({habitId: habit.id, date: setupDateForChange(), goalDetails: originalGoal}));
            return;
        } else if (goal.type != 'Off') {    // same goal type, check for change in value
            if (goal.type === 'Amount') {
                if (originalGoal.target != goal.target || originalGoal.unit != goal.unit) {
                    dispatch(addHabitGoalChange({habitId: habit.id, date: setupDateForChange(), goalDetails: originalGoal}));
                    return;
                }
            } else if (goal.type === 'Duration') {
                if (originalGoal.hours != goal.hours || originalGoal.minutes != goal.minutes) {
                    dispatch(addHabitGoalChange({habitId: habit.id, date: setupDateForChange(), goalDetails: originalGoal}));
                    return;
                }
            } else if (goal.type === 'Checklist') {
                if (originalGoal.subtasks.length != goal.subtasks.length) {
                    dispatch(addHabitGoalChange({habitId: habit.id, date: setupDateForChange(), goalDetails: originalGoal}));
                    return;
                } else {
                    for (let i = 0; i < goal.subtasks.length; i++) {
                        if (originalGoal.subtasks[i] != goal.subtasks[i]) {
                            dispatch(addHabitGoalChange({habitId: habit.id, date: setupDateForChange(), goalDetails: originalGoal}));
                            break;
                        }
                    }
                    return;
                }
            }
        }
    };

    // save previous frequency if changed to a different one
    const checkChangedFrequency = () => {
        if (habit.changes.frequencies.length > 0) {     // check if frequency has been changed back to the same as the most recent change
            if (habit.changes.frequencies.slice(-1)[0].change.type === frequency.type) {
                // check if the most recent change was made today, otherwise don't remove it
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                let changeDate = new Date(habit.changes.frequencies.slice(-1)[0].date);

                if (changeDate.getFullYear() === today.getFullYear()) {
                    if (changeDate.getMonth() === changeDate.getMonth()) {
                        if (changeDate.getDate() === today.getDate()) {
                            if (frequency.type === 'Days_of_week') {
                                if (frequency.weekdays.length === habit.changes.frequencies.slice(-1)[0].change.weekdays.length) {
                                    for (let i = 0; i < frequency.weekdays.length; i++) {
                                        if (frequency.weekdays[i] != habit.changes.frequencies.slice(-1)[0].change.weekdays[i]) {
                                            break;
                                        } else if (i === (frequency.weekdays.length - 1)) {
                                            dispatch(removeHabitFrequencyChange({habitId: habit.id}));
                                        }
                                    }
                                    return;
                                }
                            } else if (frequency.type === 'Days_of_month') {
                                if (frequency.calendarDays.length === habit.changes.frequencies.slice(-1)[0].change.calendarDays.length) {
                                    for (let i = 0; i < frequency.calendarDays.length; i++) {
                                        if (frequency.calendarDays[i] != habit.changes.frequencies.slice(-1)[0].change.calendarDays[i]) {
                                            break;
                                        } else if (i === (frequency.calendarDays.length - 1)) {
                                            dispatch(removeHabitFrequencyChange({habitId: habit.id}));
                                        }
                                    }
                                    return;
                                }
                            } else if (frequency.type === 'Repeat') {
                                if (frequency.repetition === habit.changes.frequencies.slice(-1)[0].change.repetition) {
                                    dispatch(removeHabitFrequencyChange({habitId: habit.id}));
                                    return;
                                }
                            } else if (frequency.type === 'X_days') {
                                if (frequency.interval === habit.changes.frequencies.slice(-1)[0].change.interval) {
                                    if (frequency.number === habit.changes.frequencies.slice(-1)[0].change.number) {
                                        dispatch(removeHabitFrequencyChange({habitId: habit.id}));
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (originalFrequency.type != frequency.type) {     // check for a change in frequency type
            dispatch(addHabitFrequencyChange({habitId: habit.id, date: setupDateForChange(), frequencyDetails: originalFrequency}));
            return;
        } else {    // same frequency type, check for change in value
            if (frequency.type === 'Days_of_week') {
                if (originalFrequency.weekdays.length != frequency.weekdays.length) {
                    dispatch(addHabitFrequencyChange({habitId: habit.id, date: setupDateForChange(), frequencyDetails: originalFrequency}));
                    return;
                } else {
                    for (let i = 0; i < frequency.weekdays.length; i++) {
                        if (originalFrequency.weekdays[i] != frequency.weekdays[i]) {
                            dispatch(addHabitFrequencyChange({habitId: habit.id, date: setupDateForChange(), frequencyDetails: originalFrequency}));
                            break;
                        }
                    }
                    return;
                }
            } else if (frequency.type === 'Days_of_month') {
                if (originalFrequency.calendarDays.length != frequency.calendarDays.length) {
                    dispatch(addHabitFrequencyChange({habitId: habit.id, date: setupDateForChange(), frequencyDetails: originalFrequency}));
                    return;
                } else {
                    for (let i = 0; i < frequency.calendarDays.length; i++) {
                        if (originalFrequency.calendarDays[i] != frequency.calendarDays[i]) {
                            dispatch(addHabitFrequencyChange({habitId: habit.id, date: setupDateForChange(), frequencyDetails: originalFrequency}));
                            break;
                        }
                    }
                    return;
                }
            } else if (frequency.type === 'Repeat') {
                if (originalFrequency.repetition != frequency.repetition) {
                    dispatch(addHabitFrequencyChange({habitId: habit.id, date: setupDateForChange(), frequencyDetails: originalFrequency}));
                    return;
                }
            } else if (frequency.type === 'X_days') {
                if (originalFrequency.interval != frequency.interval || originalFrequency.number != frequency.number) {
                    dispatch(addHabitFrequencyChange({habitId: habit.id, date: setupDateForChange(), frequencyDetails: originalFrequency}));
                    return;
                }
            }
        }
    };

    const saveHabit = () => {
        const habitDetails = {
            habitId: habit.id,
            habitName: name,
            habitCategory: category,
            categoryColor: color,
            habitGoal: goal,
            habitFrequency: frequency,
            habitNotes: notes,
            habitStartDate: startDate,
            habitEndDate: endDate,
            habitNotifications: notifications,
            favoriteEnabled: habit.favorite,
            habitCompletion: habit.completion,
            habitChanges: habit.changes
        };

        dispatch(editHabit(habitDetails));

        // check for a change in goal/frequency or if the goal/frequency has been changed back to the same value as the most recent change
        // also check if today is the start date, if yes: don't run functions
        let today = new Date();
        let habitStartDate = new Date(habit.startDate);
        if (today.getFullYear() === habitStartDate.getFullYear()) {
            if (today.getMonth() === habitStartDate.getMonth()) {
                if (today.getDate() === habitStartDate.getDate()) {
                    return;
                }
            }
        }

        checkChangedGoal();
        checkChangedFrequency();
    };

    const checkTextInput = () => {
        if (!name.trim()) {
            Toast.show('\n Please enter a habit name \n', {
                backgroundColor: Colors.darkGrey,
                position: Toast.positions.CENTER,
                opacity: 1,
                shadow: false,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        } else if (!category.trim()) {
            Toast.show('\n Please select a category \n', {
                backgroundColor: Colors.darkGrey,
                position: Toast.positions.CENTER,
                opacity: 1,
                shadow: false,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        } else if (!color.trim()) {
            Toast.show('\n Please select a color \n', {
                backgroundColor: Colors.darkGrey,
                position: Toast.positions.CENTER,
                opacity: 1,
                shadow: false,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        } else {
            saveHabit();
            navigation.goBack();
        }
    };

    return (
        <View style={styles.screen}>
            <KeyboardAwareScrollView ref={scrollViewRef}>
                <Text style={[styles.subHeaderText, { marginTop: 22 }]}>Name the habit</Text>
                <StringInput string={name} label='Name' setText={setName} length={20}/>

                <Text style={styles.subHeaderText}>Select a category</Text>
                <TransferOption navigation={navigation} option='Category' selectedValue={category}/>

                <Text style={styles.subHeaderText}>Daily goal</Text>
                <TransferOption navigation={navigation} option='Goal' selectedValue={goal} screenType='Edit'/>

                <Text style={styles.subHeaderText}>How often</Text>
                <TransferOption navigation={navigation} option='Frequency' selectedValue={frequency} screenType='Edit'/>

                <Text style={styles.subHeaderText}>Write some notes (optional)</Text>
                <StringInput 
                    string={notes}
                    label='Notes'
                    setText={setNotes}
                    paragraph={true}
                    scrollDown={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    length={150}
                />

                <AdvancedOptions scrollView={scrollViewRef} type='Edit' currentHabit={habit}/>
            </KeyboardAwareScrollView>
            <TouchableOpacity 
                style={[styles.buttonContainer, { height: keyboardVisible ? 0 : 60, backgroundColor: accentColor }]}  // could also use opacity to hide save button faster on ios
                onPress={() => {
                    Keyboard.dismiss();
                    checkTextInput();
                }}
            >
                <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    subHeaderText: {
        color: Colors.lightGrey,
        fontSize: width > 550 ? 20 : 17,
        fontWeight: 'bold',
        marginLeft: width > 550 ? '10.5%' : '6%',
        marginTop: Platform.OS === 'ios' ? 32 : 27
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 10,
        width: width > 550 ? '80%' : '90%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    buttonText: {
        color: 'white',
        fontSize: width > 550 ? 22 : 20,
        fontFamily: 'roboto-medium'
    }
});

export default EditHabitScreen;