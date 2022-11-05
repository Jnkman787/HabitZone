import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { checkWeekLayout } from '../utils/Weekdays';

import { markHabitUncompleted } from '../store/habitSlice';
import HomeHabitItem from '../components/HomeHabitItem';

const HomeHabitList = ({ navigation, selectedDay }) => {
    const scrollViewRef = useRef();
    const selectedHabitIndex = useRef(0);
    const habits = useSelector((state) => state.habits.habits);    // array of objects
    const startingWeekday = useSelector(state => state.settings.startingWeekday);
    const finishedPosition = useSelector(state => state.settings.finishedPosition);

    const [listedHabits, setListedHabits] = useState([]);   // list of habits to display on home screen
    const [habitListLength, setHabitListLength] = useState(habits.length);
    const [listRestarted, setListRestarted] = useState(false);
    const [chosenDay, setChosenDay] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        // update positioning of habits
        setHabitComplete();
    }, [finishedPosition]);

    const checkFrequencyChanges = (selectedHabit) => {
        let updatedFrequency = selectedHabit.frequency;
        if (selectedHabit.changes.frequencies.length > 0) {
            // find the frequency change closest to the selected day that takes place after
            let frequencyIndex;
            for (let i = 0; i < selectedHabit.changes.frequencies.length; i++) {
                let changeDate = new Date(selectedHabit.changes.frequencies[i].date);
                if (selectedDay.year === changeDate.getFullYear()) {
                    if (selectedDay.monthNumber === changeDate.getMonth()) {
                        if (selectedDay.day < changeDate.getDate()) {
                            frequencyIndex = i;
                            break;
                        }
                    } else if (selectedDay.monthNumber < changeDate.getMonth()) {
                        frequencyIndex = i;
                        break;
                    }
                } else if (selectedDay.year < changeDate.getFullYear()) {
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

    // check most recent completion to see if it needs to be uncompleted based on frequency
    const checkCompletions = (selectedHabit) => {
        let today = new Date();
        if (selectedHabit.completion.years.slice(-1)[0].months.slice(-1)[0].days.length > 0) {
            if (selectedHabit.completion.years.slice(-1)[0].year == today.getFullYear()) {
                if (selectedHabit.completion.years.slice(-1)[0].months.slice(-1)[0].month == (today.getMonth() + 1)) {
                    if (selectedHabit.completion.years.slice(-1)[0].months.slice(-1)[0].days.slice(-1)[0].date == today.getDate()) {
                        let currentDate = {
                            weekday: new Date().toDateString().slice(0, 3),
                            day: new Date().getDate(),
                            month: new Date().toDateString().slice(4, 7),
                            monthNumber: new Date().getMonth(),
                            year: new Date().getFullYear()
                        };

                        if (selectedHabit.frequency.type === 'Days_of_week') {
                            for (let i = 0; i < selectedHabit.frequency.weekdays.length; i++) {
                                if (selectedHabit.frequency.weekdays[i] === currentDate.weekday) { break; }
                                else if (i === (selectedHabit.frequency.weekdays.length - 1)) {
                                    dispatch(markHabitUncompleted({habitId: selectedHabit.id, date: currentDate}));
                                }
                            }
                        } else if (selectedHabit.frequency.type === 'Days_of_month') {
                            for (let i = 0; i < selectedHabit.frequency.calendarDays.length; i++) {
                                if (selectedHabit.frequency.calendarDays[i] === currentDate.day) { break; }
                                else if (i === (selectedHabit.frequency.calendarDays.length - 1)) {
                                    dispatch(markHabitUncompleted({habitId: selectedHabit.id, date: currentDate}));
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const sortHabitFrequencies = () => {
        let habitArray = [];

        // loop through the entire list of habits
        for (let i = 0; i < habits.length; i++) {
            // start by checking if the habit is active using its start & end dates
            let startDate = new Date(habits[i].startDate);
            if (selectedDay.year < startDate.getFullYear()) {
                continue;
            } else if (selectedDay.year === startDate.getFullYear()) {
                if (selectedDay.monthNumber < startDate.getMonth()) {
                    continue;
                } else if (selectedDay.monthNumber === startDate.getMonth()) {
                    if (selectedDay.day < startDate.getDate()) {
                        continue;
                    }
                }
            }

            if (habits[i].endDate != null) {
                let endDate = new Date(habits[i].endDate);
                if (selectedDay.year > endDate.getFullYear()) {
                    continue;
                } else if (selectedDay.year === endDate.getFullYear()) {
                    if (selectedDay.monthNumber > endDate.getMonth()) {
                        continue;
                    } else if (selectedDay.monthNumber === endDate.getMonth()) {
                        if (selectedDay.day >= endDate.getDate()) {
                            continue;
                        }
                    }
                }
            }

            // check the type of frequenncy based on frequency changes
            let currentFrequency = checkFrequencyChanges(habits[i]);

            checkCompletions(habits[i]);

            // based on the type of frequency, call upon a specific function
            if (currentFrequency.type === 'Days_of_week') {
                if (checkWeekdays(currentFrequency) == true) {
                    habitArray.push(habits[i]);
                }
            } else if (currentFrequency.type === 'Days_of_month') {
                if (checkCalendarDays(currentFrequency) == true) {
                    habitArray.push(habits[i]);
                }
            } else if (currentFrequency.type === 'Repeat') {
                if (checkRepeat(habits[i], currentFrequency) == true) {
                    habitArray.push(habits[i]);
                }
            } else if (currentFrequency.type === 'X_days') {
                habitArray.push(habits[i]);
            }
        }

        return habitArray;
    };

    // loop through the new habitArray and re-order the completed habits at the bottom of the list
    const findCompletions = (habitArray) => {
        let completedArray = [];

        for (let i = 0; i < habitArray.length; i++) {
            let currentFrequency = checkFrequencyChanges(habitArray[i]);
            if (currentFrequency.type === 'X_days') {
                let numCompletions;
                if (currentFrequency.interval === 'Week') {
                    numCompletions = checkXDaysWeek(habitArray[i]);
                } else if (currentFrequency.interval === 'Month') {
                    numCompletions = checkXDaysMonth(habitArray[i]);
                }
                if (numCompletions >= currentFrequency.number) {
                    completedArray.push(habitArray[i]);
                    habitArray.splice(i, 1);
                    i--;
                    continue;
                }
            }
            for (let x = 0; x < habitArray[i].completion.years.length; x++) {
                if (habitArray[i].completion.years[x].year == selectedDay.year) {
                    for (let y = 0; y < habitArray[i].completion.years[x].months.length; y++) {
                        if (habitArray[i].completion.years[x].months[y].month == (selectedDay.monthNumber + 1)) {
                            // check if there are any days yet completed for this month
                            if (habitArray[i].completion.years[x].months[y].days.length > 0) {
                                for (let z = 0; z < habitArray[i].completion.years[x].months[y].days.length; z++) {
                                    if (habitArray[i].completion.years[x].months[y].days[z].date == selectedDay.day) {
                                        if (habitArray[i].completion.years[x].months[y].days[z].type === 'Completed') {
                                            completedArray.push(habitArray[i]);
                                            habitArray.splice(i, 1);
                                            i--;
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
        }

        return completedArray;
    };

    // update list of displayed habits each time the database gets modified or selectedDay gets updated/changed
    useEffect(() => {
        if (selectedDay != chosenDay || habits.length != habitListLength) {
            setChosenDay(selectedDay);
            setHabitListLength(habits.length);
            setListRestarted(false);
            selectedHabitIndex.current = 0;
        }
        let habitArray = sortHabitFrequencies();
        if (finishedPosition === 'Bottom') {
            habitArray = habitArray.concat(findCompletions(habitArray));
        }
        setListedHabits(habitArray);
    }, [habits, selectedDay]);

    useEffect(() => {
        // check if the index unit is >= to the length of the list
        // if yes, set it back to zero

        if (selectedHabitIndex.current >= listedHabits.length) {
            selectedHabitIndex.current = 0;
        }

        if (listRestarted === false) { setListRestarted(true); }
    }, [listedHabits]);

    const formatSelectedDay = () => {
        let selectedDayFormat;
        if ((selectedDay.monthNumber + 1) < 10) {
            if (selectedDay.day < 10) {
                selectedDayFormat = String(selectedDay.year) + '/0' + String(selectedDay.monthNumber + 1) + '/0' + String(selectedDay.day);
            } else {
                selectedDayFormat = String(selectedDay.year) + '/0' + String(selectedDay.monthNumber + 1) + '/' + String(selectedDay.day);
            }
        } else {
            if (selectedDay.day < 10) {
                selectedDayFormat = String(selectedDay.year) + '/' + String(selectedDay.monthNumber + 1) + '/0' + String(selectedDay.day);
            } else {
                selectedDayFormat = String(selectedDay.year) + '/' + String(selectedDay.monthNumber + 1) + '/' + String(selectedDay.day);
            }
        }
        return selectedDayFormat;
    };

    const checkWeekdays = (currentFrequency) => {
        for (let i = 0; i < currentFrequency.weekdays.length; i++) {
            if (currentFrequency.weekdays[i] == selectedDay.weekday) {
                return true;
            }
        }
        return false;
    };

    const checkCalendarDays = (currentFrequency) => {
        for (let i = 0; i < currentFrequency.calendarDays.length; i++) {
            if (currentFrequency.calendarDays[i] == selectedDay.day) {
                return true;
            }
        }
        return false;
    };

    const checkRepeat = (selectedHabit, currentFrequency) => {
        let numDays = 0;
        // start by checking if the habit has any frequency changes
        if (selectedHabit.changes.frequencies.length > 0) {
            // find the date of the frequency change closest to before the selected day
            let frequencyIndex;
            for (let i = 0; i < selectedHabit.changes.frequencies.length; i++) {
                let changeDate = new Date(selectedHabit.changes.frequencies[i].date);
                if (selectedDay.year === changeDate.getFullYear()) {
                    if (selectedDay.monthNumber === changeDate.getMonth()) {
                        if (selectedDay.day >= changeDate.getDate()) { frequencyIndex = i; }
                    } else if (selectedDay.monthNumber > changeDate.getMonth()) { frequencyIndex = i; }
                } else if (selectedDay.year > changeDate.getFullYear()) { frequencyIndex = i; }
            }
            
            if (frequencyIndex >= 0) {
                numDays = new Date(formatSelectedDay()).getTime() - new Date(selectedHabit.changes.frequencies[frequencyIndex].date).getTime();
            } else {
                numDays = new Date(formatSelectedDay()).getTime() - new Date(selectedHabit.startDate).getTime();
            }
        } else {
            // get the time difference between the selected day and the start date
            numDays = new Date(formatSelectedDay()).getTime() - new Date(selectedHabit.startDate).getTime();
        }

        // calculate the # of days between the two dates
        numDays = Math.round(numDays / (1000 * 3600 * 24));
        
        if (numDays % parseInt(currentFrequency.repetition) == 0) {
            return true;
        } else { return false; }
    };

    const checkXDaysWeek = (selectedHabit, today) => {
        // setup an array containing the days for the current week Sun -> Sat
        let selectedDate = new Date(formatSelectedDay());
        if (today === true) { selectedDate = new Date(); }  // <-- use today's date when checking for notifications
        let weekArray = checkWeekLayout(selectedDate, startingWeekday);

        let timesCompleted = 0;
        // check how many completions there are within this week array
        for (let i = 0; i < weekArray.length; i++) {    // cycle through each day of the week
            for (let x = 0; x < selectedHabit.completion.years.length; x++) {
                if (selectedHabit.completion.years[x].year == weekArray[i].getFullYear()) {
                    for (let y = 0; y < selectedHabit.completion.years[x].months.length; y++) {
                        if (selectedHabit.completion.years[x].months[y].month == (weekArray[i].getMonth() + 1)) {
                            // check if there are any days yet completed for this month
                            if (selectedHabit.completion.years[x].months[y].days.length > 0) {
                                for (let z = 0; z < selectedHabit.completion.years[x].months[y].days.length; z++) {
                                    if (selectedHabit.completion.years[x].months[y].days[z].date == weekArray[i].getDate()) {
                                        if (selectedHabit.completion.years[x].months[y].days[z].type === 'Completed') {
                                            timesCompleted += 1;
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
        }

        return timesCompleted;
    };

    const checkXDaysMonth = (selectedHabit, today) => {
        // setup an array containing the days for the current month
        let selectedDate = new Date(formatSelectedDay());
        if (today === true) { selectedDate = new Date(); }  // <-- use today's date when checking for notifications
        let numDays = new Date(selectedDate.getFullYear(), (selectedDate.getMonth() + 1), 0).getDate();
        let monthArray = [];
        for (let i = 0; i < numDays; i++) {
            let day = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), (i + 1));
            monthArray.push(day);
        }

        let timesCompleted = 0;
        // check how many completions there are within this month array
        for (let i = 0; i < monthArray.length; i++) {    // cycle through each day of the month
            for (let x = 0; x < selectedHabit.completion.years.length; x++) {
                if (selectedHabit.completion.years[x].year == monthArray[i].getFullYear()) {
                    for (let y = 0; y < selectedHabit.completion.years[x].months.length; y++) {
                        if (selectedHabit.completion.years[x].months[y].month == (monthArray[i].getMonth() + 1)) {
                            // check if there are any days yet completed for this month
                            if (selectedHabit.completion.years[x].months[y].days.length > 0) {
                                for (let z = 0; z < selectedHabit.completion.years[x].months[y].days.length; z++) {
                                    if (selectedHabit.completion.years[x].months[y].days[z].date == monthArray[i].getDate()) {
                                        if (selectedHabit.completion.years[x].months[y].days[z].type === 'Completed') {
                                            timesCompleted += 1;
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
        }

        return timesCompleted;
    };

    const setSelectedHabit = (habit) => {
        selectedHabitIndex.current = habit.index;
    };

    const setHabitComplete = () => {
        let habitArray = sortHabitFrequencies();
        if (finishedPosition === 'Bottom') {
            habitArray = habitArray.concat(findCompletions(habitArray));
        }
        setListedHabits(habitArray);
    };

    return (
        <View style={{ flex: 1 }}>
            {listRestarted ? <FlatList  // Ensures FlatList uses the updated listedHabits before re-rendering the HomeHabitItems after changing the selectedDay
                ref={scrollViewRef}
                data={listedHabits}
                onContentSizeChange={() => {
                    if (listedHabits.length > 0) {
                        scrollViewRef.current.scrollToIndex({animated: true, index: selectedHabitIndex.current});
                    }
                }}
                renderItem={habitData => 
                    <HomeHabitItem 
                        navigation={navigation} 
                        habit={habitData} 
                        selectedDay={selectedDay} 
                        onSelected={setSelectedHabit}
                        onCompletion={setHabitComplete}
                        listLength={listedHabits.length}
                        checkXDaysWeek={checkXDaysWeek}
                        checkXDaysMonth={checkXDaysMonth}
                        checkFrequency={checkFrequencyChanges}
                    />
                }
            />: null}
        </View>
    );
};

const styles = StyleSheet.create({});

export default HomeHabitList;