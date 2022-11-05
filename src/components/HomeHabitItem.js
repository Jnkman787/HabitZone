import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Animated, FlatList, Platform } from 'react-native';
import { sizeUp, sizeDown } from '../utils/Animations';
import { width, verticalScale, scale } from '../utils/Scaling';
import Colors from '../utils/Colors';
import Toast from 'react-native-root-toast';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useSelector, useDispatch } from 'react-redux';

import { markHabitCompleted, markHabitUncompleted, sortHabitCompletion } from '../store/habitSlice';
import { displayHabitNotification, cancelNotification } from '../utils/Notifications';
import NumberInput from './NumberInput';

// icons
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import CustomIcon from '../utils/CustomIcon';

const getCategoryIcon = (category, completed) => {
    let icon;

    if (category === 'Quit') {
        icon = <MaterialIcons name='do-not-disturb' size={37} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Sports') {
        icon = <Ionicons name='basketball' size={38} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Study') {
        icon = <Ionicons name='school' size={34} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Work') {
        icon = <MaterialIcons name='work' size={36} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Nutrition') {
        icon = <Ionicons name='nutrition' size={38} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Home') {
        icon = <Ionicons name='home' size={33} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Outdoor') {
        icon = <Entypo name='tree' size={31} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Social') {
        icon = <MaterialCommunityIcons name='message-text' size={37} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Art') {
        icon = <Ionicons name='color-palette' size={38} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Finance') {
        icon = <CustomIcon name='coin2' size={32} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Other') {
        icon = <MaterialCommunityIcons name='dots-horizontal-circle' size={37} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Travel') {
        icon = <Ionicons name='airplane' size={33} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Health') {
        icon = <MaterialCommunityIcons name='gamepad-round' size={37} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Leisure') {
        icon = <Ionicons name='happy' size={35} color={completed === false ? 'white' : '#989ba4'}/>
    } else if (category === 'Pets') {
        icon = <Ionicons name='paw' size={33} color={completed === false ? 'white' : '#989ba4'}/>
    }

    return icon;
};

const getTimeText = (hours, minutes) => {
    if (minutes <= 9) {
        return (String(hours) + ':0' + String(minutes));
    } else {
        return (String(hours) + ':' + String(minutes));
    }
};

const HomeHabitItem = ({ navigation, habit, selectedDay, onSelected, onCompletion, listLength, checkXDaysWeek, checkXDaysMonth, checkFrequency }) => {
    const size = useRef(new Animated.Value(0)).current;
    const habits = useSelector((state) => state.habits.habits);
    const startingWeekday = useSelector(state => state.settings.startingWeekday);
    const accentColor = useSelector(state => state.settings.accentColor);
    const [currentHabit, setCurrentHabit] = useState(habit.item);
    const [currentGoal, setCurrentGoal] = useState(habit.item.goal);
    const [currentFrequency, setCurrentFrequency] = useState(checkFrequency(habit.item));
    const [isToday, setIsToday] = useState(false);

    const [selected, setSelected] = useState(false);    // use for goals other than 'Off'
    const [showSelect, setShowSelect] = useState(false);    // show circles on the left of habits & other options on the right
    const [containerHeight, setContainerHeight] = useState(width > 550 ? 115 : 100);
    const [chosenDay, setChosenDay] = useState();

    const [modalVisible, setModalVisible] = useState(false);
    
    const [selectedAmount, setSelectedAmount] = useState('1');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [completionAmount, setCompletionAmount] = useState(habit.item.goal.type === 'Amount' ? 0 : '0:00');  // use for amount & duration
    const [checklistArray, setChecklistArray] = useState([]);   // use for checklist
    const [checklistUpdated, setChecklistUpdated] = useState(false);

    const [completed, setCompleted] = useState(false);
    const [completionType, setCompletionType] = useState();     // use for goals other than 'Off'

    // use for frequency type X_days
    const [numCompletions, setNumCompletions] = useState(currentFrequency.type === 'X_days' ? currentFrequency.interval === 'Week' ? checkXDaysWeek(habit.item) : checkXDaysMonth(habit.item) : null);
    
    const dispatch = useDispatch();

    useEffect(() => {
        setChosenDay(selectedDay);
        checkSelectedDate();
    }, []);

    useEffect(() => {
        if (currentFrequency.type === 'X_days') {
            if (currentFrequency.interval === 'Week') {
                let check = checkXDaysWeek(habit.item);
                setNumCompletions(check);
            }
        }
    }, [startingWeekday]);

    useEffect(() => {
        // check if the habit has notifications enabled
        if (currentHabit.notifications.enabled === true) {

            // check if there is a full or partial completion yet recorded on today's date
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            let habitCompleted = false;
            let partial = null;

            // next check if the frequency type is X_Days
            if (currentHabit.frequency.type === 'X_days') {
                // check if the goal has already been completed for the chosen timeframe
                if (currentHabit.frequency.interval === 'Week') {
                    if (checkXDaysWeek(currentHabit, true) >= parseInt(currentHabit.frequency.number)) { habitCompleted = true; }
                } else if (currentHabit.frequency.interval === 'Month') {
                    if (checkXDaysMonth(currentHabit, true) >= parseInt(currentHabit.frequency.number)) { habitCompleted = true; }
                }
            }

            // only need to check the final value of the completion arrays
            if (currentHabit.completion.years.slice(-1)[0].year == today.getFullYear()) {
                if (currentHabit.completion.years.slice(-1)[0].months.slice(-1)[0].month == (today.getMonth() + 1)) {
                    if (currentHabit.completion.years.slice(-1)[0].months.slice(-1)[0].days.length > 0) {
                        if (currentHabit.completion.years.slice(-1)[0].months.slice(-1)[0].days.slice(-1)[0].date == today.getDate()) {
                            if (currentHabit.completion.years.slice(-1)[0].months.slice(-1)[0].days.slice(-1)[0].type === 'Completed') {
                                habitCompleted = true;
                            } else if (currentHabit.completion.years.slice(-1)[0].months.slice(-1)[0].days.slice(-1)[0].type === 'Partial') {
                                partial = currentHabit.completion.years.slice(-1)[0].months.slice(-1)[0].days.slice(-1)[0].amount;
                            }
                        }
                    }
                }
            }

            let id = habit.item.id + '_' + habit.item.name;

            // check if the habit has been marked completed
            if (habitCompleted === false) {
                cancelNotification(id);
                setTimeout(function(){
                    displayHabitNotification(currentHabit, partial, id);
                }, 100);
            } else {
                cancelNotification(id);
            }
        }
    }, [currentHabit]);

    useEffect(() => {
        if (showSelect === true) {  // no need to check if habits are completed on future dates
            let updatedGoal = currentGoal;
            if (isToday === false) { // no need to check for goal changes on today's date
                updatedGoal = checkGoalChanges();
            }
            checkCompletion(updatedGoal);
        }
    }, [showSelect]);

    useEffect(() => {
        let habitIndex = habits.findIndex(object => object.id === habit.item.id);
        if (habitIndex >= 0) {
            if (habits[habitIndex] != currentHabit) {
                setCurrentHabit(habits[habitIndex]);    // still need for old dates to get proper habit name
                checkNumCompletions(habits[habitIndex]);
                if (isToday) { setChecklistUpdated(false); }
            }
        }
    }, [habits]);

    // check goal values for old dates
    useEffect(() => {
        if (currentGoal.type === 'Duration') {
            if (currentGoal.hours === 0) { setHours(null); }
            else if (!(hours > 0)) { setHours(0); }

            if (currentGoal.minutes === 0) { setMinutes(null); }
            else if (!(minutes > 0)) { setMinutes(0); }
        } else {
            setHours(null);
            setMinutes(null);
        }

        if (currentGoal.type === 'Checklist') { 
            setChecklistUpdated(true);
            if (checklistArray.length === 0) {
                let setupChecklistArray = [];
                for (let i = 0; i < currentGoal.subtasks.length; i++) {
                    setupChecklistArray = setupChecklistArray.concat({order: null, finished: false});
                }
                setChecklistArray(setupChecklistArray);
            }
        }
    }, [currentGoal]);

    // only applies to today's date
    // check if goal has been changed and if the value is smaller than what is currently selected
    useEffect(() => {
        if (showSelect === true) {
            checkCompletion(currentHabit);
            if (isToday === true) {
                const resetAllValues = () => {
                    dispatch(markHabitUncompleted({habitId: habit.item.id, date: selectedDay}));
                    checkNumCompletions(currentHabit);
                    setCompleted(false);
                    setCompletionAmount(currentHabit.goal.type === 'Amount' ? 0 : '0:00');
                    setCompletionType('');
                    if (currentHabit.goal.type === 'Checklist') {
                        let resetChecklistArray = [];
                        for (let i = 0; i < currentHabit.goal.subtasks.length; i++) {
                            resetChecklistArray = resetChecklistArray.concat({order: null, finished: false});
                        }
                        setChecklistArray(resetChecklistArray);
                    } else if (currentHabit.goal.type === 'Duration') {
                        if (currentHabit.goal.hours > 0) { setHours(0); }
                        if (currentHabit.goal.minutes > 0) { setMinutes(0); }
                    }
                };

                // check if the goal type is different or if the value is different
                if (currentGoal.type != currentHabit.goal.type) {
                    resetAllValues();
                    setCurrentGoal(currentHabit.goal);
                } else if (currentHabit.goal.type != 'Off') {   // same goal type
                    if (currentHabit.goal.type === 'Amount') {
                        if (currentGoal.target != currentHabit.goal.target || currentGoal.unit != currentHabit.goal.unit) {
                            setCurrentGoal(currentHabit.goal);
                        }
                        if (completionAmount > currentHabit.goal.target) { resetAllValues(); }
                    
                    } else if (currentHabit.goal.type === 'Duration') {
                        if (currentGoal.hours != currentHabit.goal.hours || currentGoal.minutes != currentHabit.goal.minutes) {
                            setCurrentGoal(currentHabit.goal);
                        }

                        if (parseInt(completionAmount.split(':')[0]) > currentHabit.goal.hours || parseInt(completionAmount.split(':')[1]) > currentHabit.goal.minutes) {
                            resetAllValues();
                        } else {
                            if (currentHabit.goal.hours > 0) {
                                if (parseInt(completionAmount.split(':')[0]) <= currentHabit.goal.hours) { 
                                    setHours(parseInt(completionAmount.split(':')[0]));
                                }
                            }

                            if (currentHabit.goal.minutes > 0) {
                                if (parseInt(completionAmount.split(':')[1]) <= currentHabit.goal.minutes) { 
                                    setMinutes(parseInt(completionAmount.split(':')[1]));
                                }
                            }
                        }
                    
                    } else if (currentHabit.goal.type === 'Checklist') {
                        if (currentGoal.subtasks.length != currentHabit.goal.subtasks.length) {
                            setCurrentGoal(currentHabit.goal);
                        } else {
                            for (let i = 0; i < currentHabit.goal.subtasks.length; i++) {
                                if (currentGoal.subtasks[i] != currentHabit.goal.subtasks[i]) {
                                    setCurrentGoal(currentHabit.goal);
                                }
                            }
                        }

                        if (checklistArray.length > currentHabit.goal.subtasks.length || checklistArray.length < currentHabit.goal.subtasks.length) {
                            resetAllValues();
                        }
                        setChecklistUpdated(true);
                    }
                }

                // will only run if habit still takes place on today's date after habit change
                if (currentHabit.frequency.type != currentFrequency.type) {
                    setCurrentFrequency(currentHabit.frequency);
                } else if (currentHabit.frequency.type === 'X_days') {
                    if (currentHabit.frequency.interval != currentFrequency.interval) {
                        setCurrentFrequency(currentHabit.frequency);
                    } else if (currentHabit.frequency.number != currentFrequency.number) {
                        setCurrentFrequency(currentHabit.frequency);
                    }
                }

            } else {
                // need to check most recent completion to see if it needs to be uncompleted based on goal
                let today = new Date();
                if (habit.item.completion.years.slice(-1)[0].months.slice(-1)[0].days.length > 0) {
                    if (habit.item.completion.years.slice(-1)[0].year == today.getFullYear()) {
                        if (habit.item.completion.years.slice(-1)[0].months.slice(-1)[0].month == (today.getMonth() + 1)) {
                            if (habit.item.completion.years.slice(-1)[0].months.slice(-1)[0].days.length > 0) {
                                if (habit.item.completion.years.slice(-1)[0].months.slice(-1)[0].days.slice(-1)[0].date == today.getDate()) {
                                    let completedGoal = habit.item.completion.years.slice(-1)[0].months.slice(-1)[0].days.slice(-1)[0];
                                    let currentDate = {
                                        weekday: new Date().toDateString().slice(0, 3),
                                        day: new Date().getDate(),
                                        month: new Date().toDateString().slice(4, 7),
                                        monthNumber: new Date().getMonth(),
                                        year: new Date().getFullYear()
                                    };
    
                                    if (completedGoal.goalType != currentHabit.goal.type) {
                                        dispatch(markHabitUncompleted({habitId: habit.item.id, date: currentDate}));
                                    } else if (currentHabit.goal.type != 'Off') {
                                        if (completedGoal.type === 'Partial') {
                                            if (currentHabit.goal.type === 'Amount') {
                                                if (completedGoal.amount > currentHabit.goal.target) {
                                                    dispatch(markHabitUncompleted({habitId: habit.item.id, date: currentDate}));
                                                }
                                            } else if (currentHabit.goal.type === 'Duration') {
                                                if (parseInt(completedGoal.amount.split(':')[0]) > currentHabit.goal.hours || parseInt(completedGoal.amount.split(':')[1]) > currentHabit.goal.minutes) {
                                                    dispatch(markHabitUncompleted({habitId: habit.item.id, date: currentDate}));
                                                }
                                            } else if (currentHabit.goal.type === 'Checklist') {
                                                if (completedGoal.amount.length > currentHabit.goal.subtasks.length || completedGoal.amount.length < currentHabit.goal.subtasks.length) {
                                                    dispatch(markHabitUncompleted({habitId: habit.item.id, date: currentDate}));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, [currentHabit]);

    // check if habits should show the select option and if the selectedDay is today
    const checkSelectedDate = () => {
        let today = new Date();
        if (selectedDay.year < today.getFullYear()) {
            setShowSelect(true);
        } else if (selectedDay.year === today.getFullYear()) {    // same year
            if (selectedDay.monthNumber < today.getMonth()) {
                setShowSelect(true);
            } else if (selectedDay.monthNumber === today.getMonth()) {    // same month
                if (selectedDay.day <= today.getDate()) {
                    setShowSelect(true);
                    if (selectedDay.day === today.getDate()) { setIsToday(true); }
                }
            }
        }
    };
    
    const checkGoalChanges = () => {
        let updatedGoal = currentGoal;
        if (currentHabit.changes.goals.length > 0) {
            // find the goal change closest to the selected day that takes place after
            let goalIndex;
            for (let i = 0; i < currentHabit.changes.goals.length; i++) {   //let i = length; i >= length; i--  <-- inverse method
                let changeDate = new Date(currentHabit.changes.goals[i].date);
                if (selectedDay.year === changeDate.getFullYear()) {
                    if (selectedDay.monthNumber === changeDate.getMonth()) {
                        if (selectedDay.day < changeDate.getDate()) { 
                            goalIndex = i;
                            break;
                        }
                    } else if (selectedDay.monthNumber < changeDate.getMonth()) {
                        goalIndex = i;
                        break;
                    }
                } else if (selectedDay.year < changeDate.getFullYear()) {
                    goalIndex = i;
                    break;
                }
            }

            if (goalIndex >= 0) {
                setCurrentGoal(currentHabit.changes.goals[goalIndex].change);
                updatedGoal = currentHabit.changes.goals[goalIndex].change;
            }
        }
        return updatedGoal;
    };

    // check if a habit is already completed on the selected date
    const checkCompletion = (updatedGoal) => {
        let completion = habit.item.completion;
        for (let x = 0; x < completion.years.length; x++) {
            if (selectedDay.year == completion.years[x].year) {
                for (let y = 0; y < completion.years[x].months.length; y++) {
                    if ((selectedDay.monthNumber + 1) == completion.years[x].months[y].month) {
                        // check if there are any days yet completed for this month
                        if (completion.years[x].months[y].days.length > 0) {
                            for (let z = 0; z < completion.years[x].months[y].days.length; z++) {
                                if (selectedDay.day == completion.years[x].months[y].days[z].date) {
                                    if (completion.years[x].months[y].days[z].type === 'Completed') { 
                                        setCompleted(true);
                                        if (updatedGoal.type != 'Off') { 
                                            setCompletionType('Completed');
                                        }
                                        return;
                                    }
                                    else if (completion.years[x].months[y].days[z].type === 'Partial') {
                                        // set partial completion amounts
                                        setCompletionType('Partial');
                                        if (updatedGoal.type === 'Amount' || updatedGoal.type === 'Duration') {
                                            setCompletionAmount(completion.years[x].months[y].days[z].amount);
                                            if (updatedGoal.type === 'Duration') {
                                                if (updatedGoal.hours > 0) {
                                                    setHours(parseInt(completion.years[x].months[y].days[z].amount.split(':')[0]));
                                                }
                                                if (updatedGoal.minutes > 0) {
                                                    setMinutes(parseInt(completion.years[x].months[y].days[z].amount.split(':')[1]));
                                                }
                                            }
                                        } else if (updatedGoal.type === 'Checklist') {
                                            let completionArray = [];
                                            let orderNum = 1;
                                            // find out how many subtasks are completed to know what order number to start from
                                            for (let i = 0; i < completion.years[x].months[y].days[z].amount.length; i++) {
                                                if (completion.years[x].months[y].days[z].amount[i] === true) {
                                                    completionArray = completionArray.concat({order: orderNum, finished: true});
                                                    orderNum += 1;
                                                } else {
                                                    completionArray = completionArray.concat({order: null, finished: false});
                                                }
                                            }
                                            setChecklistArray(completionArray);
                                        }
                                        return;
                                    }
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

        // habit is not partially or fully completed on the selected date
        setSelected(false);
        setCompleted(false);
        setCompletionType('');
        setCompletionAmount(currentHabit.goal.type === 'Amount' ? 0 : '0:00');
        if (currentHabit.goal.type === 'Checklist') {
            let resetChecklistArray = [];
            for (let i = 0; i < currentHabit.goal.subtasks.length; i++) {
                resetChecklistArray = resetChecklistArray.concat({order: null, finished: false});
            }
            setChecklistArray(resetChecklistArray);
        } else if (currentHabit.goal.type === 'Duration') {
            if (currentHabit.goal.hours > 0) { setHours(0); }
            if (currentHabit.goal.minutes > 0) { setMinutes(0); }
        }
    };

    // update container height
    useEffect(() => {
        if (completed === true) { 
            setContainerHeight(width > 550 ? 115 : 100);
            sizeDown(size);
        }
        else if (currentGoal.type != 'Off') {
            if (selected === true) {
                if (currentGoal.type === 'Amount') {
                    setContainerHeight(width > 550 ? 277 : 242);
                } else if (currentGoal.type === 'Duration') {
                    setContainerHeight(width > 550 ? 197 : 172);
                } else if (currentGoal.type === 'Checklist') {
                    if (currentGoal.subtasks.length === 1) { setContainerHeight(width > 550 ? 197 : 172); }
                    else if (currentGoal.subtasks.length === 2) { setContainerHeight(width > 550 ? 263 : 228); }
                    else if (currentGoal.subtasks.length === 3) { setContainerHeight(width > 550 ? 327 : 282); }
                    else if (currentGoal.subtasks.length === 4) { setContainerHeight(width > 550 ? 392 : 337); }
                }
                setTimeout(() => {
                    sizeUp(size);
                }, 100);
            } else if (selected === false) {
                sizeDown(size);
                setTimeout(() => {
                    setContainerHeight(width > 550 ? 115 : 100);
                }, 300);
            }
        } else {
            setContainerHeight(width > 550 ? 115 : 100);
        }
    }, [selected, completed]);

    const checkAmount = () => {
        if (/^\d+$/.test(selectedAmount)) {
            if (parseInt(selectedAmount) > 0) {
                if ((parseInt(selectedAmount) + completionAmount) > parseInt(currentGoal.target)) {
                    Toast.show('Please enter a completion value less or equal to the target value', {
                        backgroundColor: Colors.darkGrey,
                        shadow: false,
                        opacity: 1,
                        textStyle: { fontSize: width > 550 ? 19 : 16 }
                    });
                } else {
                    if ((parseInt(selectedAmount) + completionAmount) == currentGoal.target) {
                        setHabitCompletion('Completed');
                    } else {
                        setHabitCompletion('Partial', (parseInt(selectedAmount) + completionAmount));
                    }
                }
            } else {
                Toast.show('Please enter a completion value greater than zero', {
                    backgroundColor: Colors.darkGrey,
                    shadow: false,
                    opacity: 1,
                    textStyle: { fontSize: width > 550 ? 19 : 16 }
                });
            }
        } else {
            Toast.show('Please enter a number for the completion value (no decimals)', {
                backgroundColor: Colors.darkGrey,
                shadow: false,
                opacity: 1,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        }
    };

    const checkTime = () => {
        if (hours === null) {
            if (minutes === 0) {
                Toast.show('Please enter a time duration of at least 1 hour', {
                    backgroundColor: Colors.darkGrey,
                    shadow: false,
                    opacity: 1,
                    textStyle: { fontSize: width > 550 ? 19 : 16 }
                });
                return;
            } else if (minutes === currentGoal.minutes) {
                setHabitCompletion('Completed');
            } else { setHabitCompletion('Partial', (getTimeText(0, minutes))); }
        } else if (minutes === null) {
            if (hours === 0) {
                Toast.show('Please enter a time duration of at least 1 minute', {
                    backgroundColor: Colors.darkGrey,
                    shadow: false,
                    opacity: 1,
                    textStyle: { fontSize: width > 550 ? 19 : 16 }
                });
                return;
            } else if (hours === currentGoal.hours) {
                setHabitCompletion('Completed');
            } else { setHabitCompletion('Partial', (getTimeText(hours, 0))); }
        } else {
            if (hours === 0 && minutes === 0) {
                Toast.show('Please enter a time duration of at least 1 minute', {
                    backgroundColor: Colors.darkGrey,
                    shadow: false,
                    opacity: 1,
                    textStyle: { fontSize: width > 550 ? 19 : 16 }
                });
                return;
            } else if (hours === currentGoal.hours && minutes === currentGoal.minutes) {
                setHabitCompletion('Completed');
            } else { setHabitCompletion('Partial', (getTimeText(hours, minutes))); }
        }
        setModalVisible(false);
    };

    const checkChecklist = (subtask) => {
        let tempArray = JSON.parse(JSON.stringify(checklistArray));
        if (tempArray[subtask.index].finished === false) {
            tempArray[subtask.index].finished = true;
            let orderNums = [];
            for (let i = 0; i < checklistArray.length; i++) {
                if (checklistArray[i].order != null) {
                    orderNums = orderNums.concat(checklistArray[i].order);
                }
            }
            if (orderNums.length === 0) { tempArray[subtask.index].order = 1; }
            else { tempArray[subtask.index].order = (Math.max(...orderNums) + 1); }
        } else {
            tempArray[subtask.index].finished = false;
            tempArray[subtask.index].order = null;
        }
        setChecklistArray(tempArray);
    };

    useEffect(() => {
        if (currentGoal.type === 'Checklist') {
            let completedSubtasks = [];
            for (let i = 0; i < checklistArray.length; i++) {
                completedSubtasks = completedSubtasks.concat(checklistArray[i].finished);
            }
            if (completedSubtasks.filter(value => value === true).length === currentGoal.subtasks.length) { setHabitCompletion('Completed'); }
            else if (completedSubtasks.filter(value => value === true).length > 0) {
                setHabitCompletion('Partial', completedSubtasks);
            }
        }
    }, [checklistArray]);

    const setHabitCompletion = (type, value) => {
        // start by checking if habit is already marked as completed
        if (completed) {
            dispatch(markHabitUncompleted({habitId: habit.item.id, date: selectedDay}));
            setCompleted(false);
            if (currentGoal.type != 'Off') {
                setCompletionType('');
                if (currentGoal.type != 'Checklist') { 
                    setCompletionAmount(currentGoal.type === 'Amount' ? 0 : '0:00');
                    if (hours != null) { setHours(0); }
                    if (minutes != null) { setMinutes(0); }
                } else {
                    let resetChecklistArray = [];
                    for (let i = 0; i < checklistArray.length; i++) {
                        resetChecklistArray = resetChecklistArray.concat({order: null, finished: false});
                    }
                    setChecklistArray(resetChecklistArray);
                }
            }
            onCompletion();
        } else if (completed === false) {
            // check goal types
            if (currentGoal.type === 'Off') {
                dispatch(markHabitCompleted({habitId: habit.item.id, dayType: 'Completed', goal: currentGoal, date: selectedDay}));
                dispatch(sortHabitCompletion({habitId: habit.item.id}));
                setCompleted(true);
            } else if (type === 'Completed') {
                dispatch(markHabitCompleted({habitId: habit.item.id, dayType: 'Completed', goal: currentGoal, date: selectedDay}));
                dispatch(sortHabitCompletion({habitId: habit.item.id}));
                setSelected(false);
                setCompleted(true);
                setCompletionType('Completed');
            } else if (type === 'Partial') {
                dispatch(markHabitCompleted({habitId: habit.item.id, dayType: 'Partial', goal: currentGoal, date: selectedDay, amount: value}));
                dispatch(sortHabitCompletion({habitId: habit.item.id}));
                setCompletionType('Partial');
                if (currentGoal.type != 'Checklist') { 
                    setCompletionAmount(value);
                    setSelected(false);
                }
            }
            onCompletion();
        }
    };

    const undoHabitCompletion = () => {
        // check if habit is fully or partially completed
        if (completed) { setHabitCompletion(); }
        else if (completionType === 'Partial') {
            if (currentGoal.type === 'Amount') {
                // check that the selected amount doesn't set the completionAmount below zero
                if ((completionAmount - parseInt(selectedAmount)) <= 0) {
                    dispatch(markHabitUncompleted({habitId: habit.item.id, date: selectedDay}));
                    setCompleted(false);
                    setCompletionAmount(0);
                    setCompletionType('');
                } else {
                    setHabitCompletion('Partial', (completionAmount - parseInt(selectedAmount)));
                }
            } else if (currentGoal.type === 'Duration') {
                dispatch(markHabitUncompleted({habitId: habit.item.id, date: selectedDay}));
                setCompleted(false);
                setCompletionAmount('0:00');
                setCompletionType('');
                if (hours != null) { setHours(0); }
                if (minutes != null) { setMinutes(0); }
            } else if (currentGoal.type === 'Checklist') {
                // set the array value with the highest order # to false
                let highestOrder = 1;
                for (let i = 0; i < checklistArray.length; i++) {
                    if (checklistArray[i].finished === true) {
                        if (checklistArray[i].order > highestOrder) { highestOrder = checklistArray[i].order }
                    }
                }
                let orderIndex = checklistArray.findIndex(object => object.order === highestOrder);
                let tempArray = JSON.parse(JSON.stringify(checklistArray));
                tempArray[orderIndex] = {order: null, finished: false};
                setChecklistArray(tempArray);
            }
        }
    };

    const checkNumCompletions = (updatedHabit) => {
        let frequency = updatedHabit.frequency;
        // check if the selected date is today
        if (isToday === false) {
            frequency = currentFrequency;
        }
        if (frequency.type === 'X_days') {
            if (frequency.interval === 'Week') {
                setNumCompletions(checkXDaysWeek(updatedHabit));
            } else if (frequency.interval === 'Month') {
                setNumCompletions(checkXDaysMonth(updatedHabit));
            }
        }
    };

    const getGoal = (goal) => {
        let displayValue;

        if (goal.type === 'Amount') {
            if (goal.unit != undefined) {
                displayValue = completionAmount + ' / ' + goal.target + ' ' + goal.unit;
            } else {
                displayValue = completionAmount + ' / ' + goal.target
            }
        } else if (goal.type === 'Duration') {
            if (goal.hours > 0) {
                if (goal.minutes > 0) {
                    if (hours === 0 && minutes === 0) { displayValue = '0 / ' + goal.hours + 'h ' + goal.minutes + 'min'; } 
                    else {
                        displayValue = completionAmount.split(':')[0] + 'h ' + parseInt(completionAmount.split(':')[1]) + 'min / ' + goal.hours + 'h ' + goal.minutes + 'min';
                    }
                } else {
                    if (hours === 0) { displayValue = '0 / ' + goal.hours + 'h'; }
                    else { displayValue = completionAmount.split(':')[0] + 'h / ' + goal.hours + 'h'; }
                }
            } else if (goal.minutes > 0) {
                if (minutes === 0) { displayValue = '0 / ' + goal.minutes + 'min'; }
                else { displayValue = parseInt(completionAmount.split(':')[1]) + 'min / ' + goal.minutes + 'min'; }
            }
        } else if (goal.type === 'Checklist') {
            let completedSubtasks = [];
            for (let i = 0; i < checklistArray.length; i++) {
                completedSubtasks = completedSubtasks.concat(checklistArray[i].finished);
            }
            let numCompleted = completedSubtasks.filter(value => value === true).length;
            if (goal.subtasks.length > 1) {
                displayValue = numCompleted + ' / ' + goal.subtasks.length + ' subtasks';
            } else {
                displayValue = numCompleted + ' / ' + goal.subtasks.length + ' subtask';
            }
        }
        
        return displayValue;
    };

    const TitleLayout = () => {
        let goal = getGoal(currentGoal);

        // check if the selected day is in the past
        let isPast = false;
        let today = new Date();
        if (selectedDay.year < today.getFullYear()) { isPast = true; }
        else if (selectedDay.year === today.getFullYear()) {
            if (selectedDay.monthNumber < today.getMonth()) { isPast = true; }
            else if (selectedDay.monthNumber === today.getMonth()) {
                if (selectedDay.day < today.getDate()) { isPast = true; }
            }
        }

        if (width < 550 && isPast) {
            if (goal != null) {
                if (completionType != 'Partial') { if (goal.length > 19) { goal = goal.slice(0, 15) + ' ...'; } }
            }
        }

        if (currentFrequency.type === 'X_days') {
            if (numCompletions >= currentFrequency.number) {
                return (
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ color: '#a0a3ab', fontSize: width > 550 ? 21 : 18, fontFamily: 'roboto-medium' }}>{currentHabit.name}</Text>
                        <View style={{ height: 4 }}/>
                        {completed ? <Text style={{ color: '#a0a3ab', fontSize: width > 550 ? 17 : 15 }}>Finished</Text>
                            : <Text style={{ color: '#a0a3ab', fontSize: width > 550 ? 17 : 15 }}>Do it more if you wish!</Text>
                        }
                    </View>
                );
            }
        }
        
        if (goal != null) {
            return (
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: completed === false ? 'white' : '#a0a3ab', fontSize: width > 550 ? 21 : 18, fontFamily: 'roboto-medium' }}>{currentHabit.name}</Text>
                    <View style={{ height: 4 }}/>
                    {completed ? <Text style={{ color: '#a0a3ab', fontSize: width > 550 ? 17 : 15 }}>Finished</Text>
                        : <Text style={{ color: 'white', fontSize: width > 550 ? 17 : 15 }}>{isPast ? completionType === 'Partial' ? null : 'Missed, ' : null}{goal}</Text>
                    }
                </View>
            );
        } else {
            if (completed || isPast) {
                return (
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ color: completed === false ? 'white' : '#a0a3ab', fontSize: width > 550 ? 21 : 18, fontFamily: 'roboto-medium' }}>{currentHabit.name}</Text>
                        <View style={{ height: 4 }}/>
                        <Text style={{ color: completed === false ? 'white' : '#a0a3ab', fontSize: width > 550 ? 17 : 15 }}>{completed ? 'Finished' : isPast ? 'Missed' : null}</Text>
                    </View>
                );
            } else {
                return (
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ color: completed === false ? 'white' : '#a0a3ab', fontSize: width > 550 ? 21 : 18, fontFamily: 'roboto-medium' }}>{currentHabit.name}</Text>
                    </View>
                );
            }
        }
    };

    const DurationSlider = (timespan) => {
        let time;
        if (timespan === 'Hours') {
            if (hours == 1) { time = hours + ' hour' }
            else { time = hours + ' hours' }
        } else if (timespan === 'Minutes') {
            if (minutes == 1) { time = minutes + ' minute' }
            else { time = minutes + ' minutes' }
        }

        return (
            <View>
                <Text style={{ color: 'white', alignSelf: 'center', marginTop: 15, fontSize: width > 550 ? 20 : 17 }}>{time}</Text>
                <Slider
                    style={{ width: '85%', alignSelf: 'center', marginTop: 15 }}
                    minimumValue={0}
                    maximumValue={timespan === 'Hours' ? currentGoal.hours : currentGoal.minutes}
                    step={1}
                    minimumTrackTintColor={accentColor}
                    maximumTrackTintColor='grey'
                    thumbTintColor='white'
                    value={timespan === 'Hours' ? hours : minutes}
                    onValueChange={value => {
                        clearTimeout(x);
                        let x = setTimeout(() => {
                            timespan === 'Hours' ? setHours(value) : setMinutes(value)
                        }, 20)
                    }}
                />
            </View>
        );
    };

    const CompletionInputs = () => {
        if (currentGoal.type != 'Off') {
            if (currentGoal.type === 'Amount') {
                let unit = '';
                if (currentGoal.unit != undefined) {
                    unit = JSON.parse(JSON.stringify(currentGoal.unit));
                    if (width < 550) {
                        if (selectedAmount.length === 3) {
                            if (unit.length > 7) { unit = unit.slice(0, 9); }
                        } else if (selectedAmount.length === 2) {
                            if (unit.length > 8) { unit = unit.slice(0, 10); }
                        } else {
                            if (unit.length > 9) { unit = unit.slice(0, 11); }
                        }
                    }
                }

                return (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', right: width > 550 ? 6 : 0 }}>
                        <NumberInput number={selectedAmount} label='Amount' setNumber={setSelectedAmount} style={{ width: width > 550 ? '36%' : '40%', paddingTop: 5 }} max={3}/>
                        <View style={{ marginLeft: width > 550 ? 15 : 10, marginRight: 5, width: width > 550 ? '42%' : '50%' }}>
                            <TouchableOpacity
                                style={[styles.amountButtons, { backgroundColor: Colors.lightTheme }]}
                                onPress={() => checkAmount()}
                            >
                                <View style={[styles.unitCircle, { backgroundColor: accentColor }]}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: width > 550 ? 16 : 13 }}>{selectedAmount}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontWeight: 'bold', color: 'white', fontSize: width > 550 ? 17 : 15, marginLeft: 10 }}>FINISH</Text>
                                    <Text style={{ fontWeight: 'bold', color: 'white', fontSize: width > 550 ? 16 : 13, marginLeft: 10 }}>{selectedAmount} {unit}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ height: 15 }}/>
                            <TouchableOpacity
                                style={[styles.amountButtons, { backgroundColor: '#70b536', justifyContent: 'center' }]}
                                onPress={() => setHabitCompletion('Completed')}
                            >
                                <Entypo name='check' size={25} color='white'/>
                                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: width > 550 ? 17 : 15, marginLeft: 10 }}>FINISH ALL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            } else if (currentGoal.type === 'Duration') {
                return (
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={[styles.durationButtons, { backgroundColor: Colors.lightTheme }]}
                            onPress={() => setModalVisible(true)}
                        >
                            <MaterialCommunityIcons name='clock' size={28} color='white'/>
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: width > 550 ? 17 : 15, marginLeft: 10 }}>TIME</Text>
                        </TouchableOpacity>
                        <View style={{ width: width > 550 ? 20 : 15 }}/>
                        <TouchableOpacity
                            style={[styles.durationButtons, { backgroundColor: '#70b536' }]}
                            onPress={() => setHabitCompletion('Completed')}
                        >
                            <Entypo name='check' size={25} color='white'/>
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: width > 550 ? 17 : 15, marginLeft: 10 }}>FINISH</Text>
                        </TouchableOpacity>
                    </View>
                );
                
            } else if (currentGoal.type === 'Checklist') {
                let tasks = JSON.parse(JSON.stringify(currentGoal.subtasks));
                if (width < 550) {
                    for (let i = 0; i < tasks.length; i++) {
                        if (tasks[i].length > 19) { tasks[i] = tasks[i].slice(0, 19) + ' ...'; }
                    }
                }

                return (
                    <View>
                        {checklistUpdated === true ? <FlatList
                            data={tasks}
                            renderItem={task =>
                                <TouchableOpacity 
                                    style={[styles.checklistButtons, {
                                        borderTopLeftRadius: task.item === tasks[0] ? 15 : 0,
                                        borderTopRightRadius: task.item === tasks[0] ? 15 : 0,
                                        borderBottomLeftRadius: task.item === tasks.slice(-1)[0] ? 15 : 0,
                                        borderBottomRightRadius: task.item === tasks.slice(-1)[0] ? 15 : 0,
                                    }]}
                                    onPress={() => checkChecklist(task)}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'roboto-medium', fontSize: width > 550 ? 19 : 17,
                                            color: checklistArray[task.index].finished === true ? 'grey' : 'white',
                                        }}>{task.item}</Text>
                                        <View style={[styles.completionCircle, {
                                            backgroundColor: checklistArray[task.index].finished === true ? 'green' : null,
                                            borderColor: checklistArray[task.index].finished === true ? 'green' : 'white',
                                            justifyContent: 'center'
                                        }]}>
                                            {checklistArray[task.index].finished === true 
                                                ? <View style={{ alignSelf: 'center' }}><Entypo name='check' size={19} color='white'/></View>
                                                : null
                                            }
                                        </View>
                                    </View>
                                    <View style={{
                                        borderBottomWidth: task.item != tasks.slice(-1)[0] ? 0.5 : 0,
                                        borderBottomColor: 'white',
                                        top: width > 550 ? 14 : 12.5
                                    }}/>
                                </TouchableOpacity>
                            }
                        /> : null}
                    </View>
                );
            }
        }
    };

    return (
        <View>
            {selectedDay === chosenDay ? <View style={{ height: currentFrequency.type === 'X_days' ? (containerHeight + 24) : containerHeight, width: width > 550 ? '90%' : '100%', alignSelf: 'center', 
                top: currentFrequency.type === 'X_days' ? 24 : 0
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                    {showSelect === true ? <TouchableOpacity
                        style={{ width: 57, height: 80, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: width > 550 ? 10 : 0 }}
                        onPress={() => {
                            onSelected(habit);
                            if (currentGoal.type === 'Off') {
                                setHabitCompletion();
                            } else {
                                if (completed) { setHabitCompletion(); }
                                else {
                                    if (selected === false && containerHeight <= 115) {
                                        setSelected(true);
                                    } else if (selected === true && containerHeight > 115) {
                                        setSelected(false);
                                    }
                                }
                            }
                        }}
                    >
                        {completed === true
                            ? <View style={[styles.completionCircle, { backgroundColor: 'green', borderColor: 'green', alignItems: 'center', justifyContent: 'center' }]}>
                                <Entypo name='check' size={width > 550 ? 22 : 19} color='white'/>
                            </View>
                            : currentGoal.type != 'Off'
                                ? selected === true 
                                    ? <AntDesign name='up' size={width > 550 ? 30 : 25} color='white'/>
                                    : <View style={styles.completionCircle}/>
                                : <View style={styles.completionCircle}/>
                        }
                    </TouchableOpacity> : <View style={{ width: 15 }}/>}
                    
                    <View style={{ flex: 1, height: width > 550 ? 95 : 80 }}>
                        {currentFrequency.type === 'X_days' ? <View style={{ flexDirection: 'row', height: 40, width: width > 550 ? '54%' : '73%', backgroundColor: Colors.lightTheme,
                            paddingTop: width > 550 ? 1 : Platform.OS === 'ios' ? 4 : 3, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingLeft: width > 550 ? '14%' : '7%', position: 'absolute', top: -24
                        }}>
                            <Text style={{ color: '#ffab1a', fontWeight: 'bold', marginRight: width > 550 ? 6 : 4, fontSize: width > 550 ? 15 : 14, top: Platform.OS === 'ios' ? 0 : width > 550 ? 0 : -1 }}>
                                {numCompletions}/{currentFrequency.number}
                            </Text>
                            <Text style={{ color: 'white', fontSize: width > 550 ? 12 : 11, paddingTop: width > 550 ? 2.6 : 1.7 }}>DAYS FINISHED THIS {currentFrequency.interval === 'Week' ? 'WEEK' : 'MONTH'}</Text>
                        </View> : null}

                        <TouchableHighlight
                            style={[styles.habitContainer, { marginRight: 15 }]}
                            onPress={() => navigation.navigate('DetailsStack', { screen: 'HabitDetails', params: { selectedHabit: currentHabit } })}
                            underlayColor={Colors.theme}
                        >
                            <View style={[styles.habitContainer, { marginRight: 0, flexDirection: 'row',
                                backgroundColor: completed === true ? '#212f45' : currentFrequency.type === 'X_days' ? numCompletions >= currentFrequency.number ? '#212f45' : habit.item.color : habit.item.color
                            }]}>
                                <View style={{ alignItems: 'center', width: '22%' }}>
                                    {getCategoryIcon(habit.item.category, currentFrequency.type === 'X_days' ? numCompletions >= currentFrequency.number ? true : completed : completed)}
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {TitleLayout()}
                                    {showSelect === true ? <Menu>
                                        <MenuTrigger customStyles={{ triggerWrapper: styles.otherOptionsButton }}>
                                            <Entypo name='dots-three-horizontal' size={25} style={{ left: width > 550 ? 15 : 5 }} 
                                                color={ completed === true ? '#989ba4' : currentFrequency.type === 'X_days' ? numCompletions >= currentFrequency.number ? '#989ba4' : 'white' : 'white' }
                                            />
                                        </MenuTrigger>
                                        <MenuOptions customStyles={{ optionsContainer: [styles.menuContainer, { 
                                            marginTop: width > 550 ? listLength >= 6 ? habit.index >= 5 ? -70 : 65 : 65 : listLength >= 5 ? habit.index >= 4 ? -75 : 55 : 55
                                        }] }}>
                                            <MenuOption 
                                                style={[styles.menuOptionLayout, { borderBottomColor: 'white', borderBottomWidth: 0.5 }]}
                                                onSelect={() => {
                                                    undoHabitCompletion();
                                                }}
                                            >
                                                <EvilIcons name='undo' size={36} color='white' style={{ marginRight: 5 }}/>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: width > 550 ? 19 : 17 }}>Undo</Text>
                                            </MenuOption>
                                            <MenuOption 
                                                style={styles.menuOptionLayout}
                                                onSelect={() => {
                                                    setSelected(false);
                                                    navigation.navigate('DetailsStack', { screen: 'EditHabit', params: { habit: currentHabit } })
                                                }}
                                            >
                                                <Octicons name='pencil' size={21} color='white' style={{ marginLeft: 8, marginRight: 14 }}/>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: width > 550 ? 19 : 17 }}>Edit</Text>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu> : null}
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>

                <Animated.View
                    style={[styles.inputContainer, {
                        transform: [{ scale: size }]
                    }]}
                >
                    {completed === false ? CompletionInputs() : null}
                </Animated.View>
            </View> : null}

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.55}
            >
                <View style={[styles.modalContainer, {
                    height: (hours === null || minutes === null) ? Platform.OS === 'ios' ? width > 550 ? 250 : 230 : width > 550 ? 230 : 210
                    : Platform.OS === 'ios' ? width > 550 ? 345 : 320 : width > 550 ? 305 : 280
                }]}>
                    <View style={styles.headerLayout}>
                        <Text style={styles.headerText}>Set the time completed</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <AntDesign name='close' size={29} color='white'/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.border}/>
                    {hours != null ? DurationSlider('Hours') : null}
                    {minutes != null ? DurationSlider('Minutes') : null}
                    <TouchableOpacity
                        style={[styles.setTimeButton, { backgroundColor: accentColor }]}
                        onPress={() => checkTime()}
                    >
                        <Text style={{ color: 'white', alignSelf: 'center', fontSize: width > 550 ? 20 : 18, fontWeight: 'bold' }}>SET</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    completionCircle: {
        width: width > 550 ? 35 : 30,
        height: width > 550 ? 35 : 30,
        borderRadius: width > 550 ? 18 : 15,
        borderWidth: 2,
        borderColor: 'white'
    },
    habitContainer: {
        flex: 1,
        height: width > 550 ? 95 : 80,
        borderRadius: 20,
        alignItems: 'center'
    },
    inputContainer: {
        flex: 1,
        marginTop: 5,
        marginLeft: 57,
        marginRight: 15,
        marginBottom: 10,
    },
    amountButtons: {
        width: '100%',
        height: width > 550 ? 65 : 55,
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center'
    },
    unitCircle: {
        width: width > 550 ? 35 : 30,
        height: width > 550 ? 35 : 30,
        borderRadius: width > 550 ? 18 : 15,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    durationButtons: {
        width: width > 550 ? '37%' : '43%',
        height: width > 550 ? 65 : 55,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    checklistButtons: {
        height: width > 550 ? 65 : 55,
        width: width > 550 ? '78.5%' : '92%',
        backgroundColor: Colors.lightTheme,
        paddingHorizontal: 15,
        alignSelf: 'center',
        justifyContent: 'center',
        left: width > 550 ? '0.5%' : 0
    },
    otherOptionsButton: {
        justifyContent: 'center',
        height: width > 550 ? 95 : 80,
        width: width > 550 ? 60 : 40,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        zIndex: 1
    },
    menuContainer: {
        backgroundColor: Colors.subTheme,
        width: width > 550 ? 150 : 120,
        borderRadius: 8
    },
    menuOptionLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50
    },
    modalContainer: {
        backgroundColor: Colors.subTheme,
        borderRadius: 15,
        width: width > 550 ? '75%' : '95%',
        alignSelf: 'center'
    },
    headerLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: width > 550 ? verticalScale(15): 15,
        marginHorizontal: width > 550 ? scale(17) : 17
    },
    headerText: {
        color: 'white',
        fontSize: width > 550 ? 22 : 18,
        fontFamily: 'roboto-medium'
    },
    border: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        width: '100%'
    },
    setTimeButton: {
        marginTop: 15,
        width: width > 550 ? 75 : 70,
        height: width > 550 ? 45 : 40,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 15
    }
});

export default HomeHabitItem;