import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';
import SwitchSelector from 'react-native-switch-selector';
import { useSelector } from 'react-redux';

import { AntDesign } from '@expo/vector-icons';

const HorizontalCalendar = ({ selectedWeekday, setSelectedWeekday, resetDay }) => {
    const referenceDate = useRef(new Date());
    const index = useRef();
    const dates = useRef([]);
    const selectedDate = useRef(new Date());
    const [textValues, setTextValues] = useState([]);
    const [selectedColor, setSelectedColor] = useState(Colors.subTheme);
    const [calendarReset, setCalendarReset] = useState(false);
    const [weekdayArray, setWeekdayArray] = useState([]);
    const [setupFinished, setSetupFinished] = useState(false);

    const startingWeekday = useSelector(state => state.settings.startingWeekday);
    const accentColor = useSelector(state => state.settings.accentColor);

    const resetSelectedDay = () => {
        let day = new Date();
        referenceDate.current = day;
        selectedDate.current = day;
        checkWeekLayout();
        index.current = findIndex(day);
        saveSelectedDayObject(day);
        setCalendarReset(false);
    };

    useEffect(() => {
        if (calendarReset === false) { setCalendarReset(true); }
    }, [calendarReset]);

    const addPastDays = (days) => {
        let pastDay = new Date(referenceDate.current);
        pastDay.setDate(pastDay.getDate() - days);
        return pastDay;
    };

    const addFutureDays = (days) => {
        let futureDay = new Date(referenceDate.current);
        futureDay.setDate(futureDay.getDate() + days);
        return futureDay;
    };

    const generateWeeklyCalendarDates = (pastDays, futureDays) => {
        let result = [referenceDate.current];

        for (let i = 1; i <= futureDays; i++) {
            result[i] = addFutureDays(i);
        }
        result.reverse();

        for (let i = futureDays + 1; i <= futureDays + pastDays; i++) {
            result[i] = addPastDays(i - futureDays);
        }
        result.reverse();

        // dates array will have UTC dates but will get local time zone dates when converted to string
        dates.current = result;

        // set weekly text values
        let textArray = [];
        for (let i = 0; i < dates.current.length; i++) {
            textArray = [...textArray, dates.current[i].getDate()];
        }
        setTextValues(textArray);
    };

    const weekdayIndex = (weekday) => {
        if (weekday === 'Sun') { return 0; }
        else if (weekday === 'Mon') { return 1; }
        else if (weekday === 'Tue') { return 2; }
        else if (weekday === 'Wed') { return 3; }
        else if (weekday === 'Thu') { return 4; }
        else if (weekday === 'Fri') { return 5; }
        else if (weekday === 'Sat') { return 6; }
    };

    // generate weekly calendar based on chosen day of the week and starting weekday
    const checkWeekLayout = () => {
        let weekday = referenceDate.current.toString().slice(0, 3);
        let startingWeekdayPosition = weekdayIndex(startingWeekday);
        let weekdayPosition = weekdayIndex(weekday);

        let numDaysBefore = 0;
        if (startingWeekdayPosition > weekdayPosition) {
            numDaysBefore = 6 - startingWeekdayPosition + weekdayPosition + 1;
        } else if (startingWeekdayPosition < weekdayPosition) {
            numDaysBefore = weekdayPosition - startingWeekdayPosition;
        }
        let numDaysAfter = 6 - numDaysBefore;

        generateWeeklyCalendarDates(numDaysBefore, numDaysAfter);
    };

    useEffect(() => {
        checkWeekLayout();
        resetDay.current = resetSelectedDay;
        if (setupFinished === false) {
            index.current = findIndex(referenceDate.current);
        } else {
            index.current = undefined;
            index.current = findIndex(selectedDate.current);
            if (index.current === undefined) {   // selected day is not in new updated array of dates
                setSelectedColor(Colors.subTheme);
            } else {
                setSelectedColor(accentColor);
                setCalendarReset(false);
            }
        }
        setSetupFinished(true);

        // update order of weekdays displayed at top of horizontal bar
        if (startingWeekday === 'Sun') { setWeekdayArray(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']); }
        else if (startingWeekday === 'Mon') { setWeekdayArray(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']); }
        else if (startingWeekday === 'Tue') { setWeekdayArray(['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']); }
        else if (startingWeekday === 'Wed') { setWeekdayArray(['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']); }
        else if (startingWeekday === 'Thu') { setWeekdayArray(['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']); }
        else if (startingWeekday === 'Fri') { setWeekdayArray(['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']); }
        else if (startingWeekday === 'Sat') { setWeekdayArray(['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']); }
    }, [startingWeekday]);

    useEffect(() => {
        checkSelectedDate();
    }, [selectedWeekday]);

    useEffect(() => {
        if (index.current != undefined) {
            checkSelectedDate();
        }
    }, [accentColor]);

    const findIndex = (specifiedDate) => {
        // get current date, find index in dates array
        for (let i = 0; i < dates.current.length; i++) {
            if (specifiedDate.getFullYear() === dates.current[i].getFullYear()) {
                if (specifiedDate.getMonth() === dates.current[i].getMonth()) {
                    if (specifiedDate.getDate() === dates.current[i].getDate()) {
                        return i;
                    }
                }
            }
        }
    };

    const checkSelectedDate = () => {
        // check if same year, month & day
        if (index.current === undefined) {
            index.current = findIndex(referenceDate.current);
        }

        if (selectedWeekday.year == dates.current[index.current].getFullYear()) {
            if (selectedWeekday.monthNumber == dates.current[index.current].getMonth()) {
                if (selectedWeekday.day == dates.current[index.current].getDate()) {
                    setSelectedColor(accentColor);
                    return;
                }
            }
        }
        setSelectedColor(Colors.subTheme);
    };

    // update date array with last week's dates
    const onTapLeft = () => {
        // get last week's final date and set it as the reference date
        let finalDate = new Date(dates.current[0]);
        finalDate.setDate(finalDate.getDate() - 1);
        referenceDate.current = finalDate;
        checkWeekLayout();
        
        if (index.current === undefined) {
            index.current = findIndex(selectedDate.current);
            if (index.current === undefined) {
                setSelectedColor(Colors.subTheme);
            } else {
                setSelectedColor(accentColor);
                setCalendarReset(false);
            }
        } else {
            checkSelectedDate();
        }
    };

    // update date array with next week's dates
    const onTapRight = () => {
        // get next week's starting date and set it as the reference date
        let startDate = new Date(dates.current[6]);
        startDate.setDate(startDate.getDate() + 1);
        referenceDate.current = startDate;
        checkWeekLayout();

        if (index.current === undefined) {
            index.current = findIndex(selectedDate.current);
            if (index.current === undefined) {
                setSelectedColor(Colors.subTheme);
            } else {
                setSelectedColor(accentColor);
                setCalendarReset(false);
            }
        } else {
            checkSelectedDate();
        }
    };

    const saveSelectedDayObject = (selectedDay) => {
        setSelectedWeekday({
            weekday: selectedDay.toDateString().slice(0, 3),
            day: selectedDay.getDate(),
            month: selectedDay.toDateString().slice(4, 7),
            monthNumber: selectedDay.getMonth(),
            year: selectedDay.getFullYear()
        });
        selectedDate.current = new Date(selectedDay);
    };

    return !dates.current ? null : (
        <View>
            <View style={styles.weekdayTextContainer}>
                <View style={styles.individualTextContainer}>
                    <Text style={styles.weekdayListText}>{weekdayArray[0]}</Text>
                </View>
                <View style={styles.individualTextContainer}>
                    <Text style={styles.weekdayListText}>{weekdayArray[1]}</Text>
                </View>
                <View style={styles.individualTextContainer}>
                    <Text style={styles.weekdayListText}>{weekdayArray[2]}</Text>
                </View>
                <View style={styles.individualTextContainer}>
                    <Text style={styles.weekdayListText}>{weekdayArray[3]}</Text>
                </View>
                <View style={styles.individualTextContainer}>
                    <Text style={styles.weekdayListText}>{weekdayArray[4]}</Text>
                </View>
                <View style={styles.individualTextContainer}>
                    <Text style={styles.weekdayListText}>{weekdayArray[5]}</Text>
                </View>
                <View style={styles.individualTextContainer}>
                    <Text style={styles.weekdayListText}>{weekdayArray[6]}</Text>
                </View>
            </View>

            {calendarReset ? <View style={styles.horizontalCalendarContainer}>
                <TouchableOpacity onPress={() => onTapLeft()} style={{ zIndex: 1 }}>
                    <AntDesign name='caretleft' size={width > 550 ? 30 : 25} color='white' style={{ left: 1, top: 1 }}/>
                </TouchableOpacity>
                <SwitchSelector
                    initial={findIndex(selectedDate.current)}    // index of options
                    onPress={(day) => {
                        index.current = findIndex(day);
                        saveSelectedDayObject(day);
                    }}
                    textColor={'white'}
                    textStyle={{ fontWeight: 'bold' }}
                    selectedTextStyle={{ fontWeight: 'bold' }}
                    buttonColor={selectedColor}
                    buttonMargin={width > 550 ? 4 : 0}
                    fontSize={width > 550 ? 20 : 18}
                    backgroundColor={Colors.subTheme}
                    animationDuration={250}
                    options={[
                        { label: textValues[0], value: dates.current[0] },
                        { label: textValues[1], value: dates.current[1] },
                        { label: textValues[2], value: dates.current[2] },
                        { label: textValues[3], value: dates.current[3] },
                        { label: textValues[4], value: dates.current[4] },
                        { label: textValues[5], value: dates.current[5] },
                        { label: textValues[6], value: dates.current[6] }
                    ]}
                    height={width > 550 ? 60 : 43} // may change the height to 60 for width > 550
                    style={styles.switchContainer}    // exterior style
                />
                <TouchableOpacity onPress={() => onTapRight()}>
                    <AntDesign name='caretright' size={width > 550 ? 30 : 25} color='white' style={{ right: 1, top: 1 }}/>
                </TouchableOpacity>
            </View> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    weekdayTextContainer: {
        height: 40,
        width: width > 550 ? '74%' : '79%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    individualTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: width > 550 ? 40 : 35
    },
    weekdayListText: {
        color: 'white',
        fontFamily: 'roboto-medium',
        fontSize: width > 550 ? 18 : 16
    },
    horizontalCalendarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width > 550 ? '90%' : '97%',
        alignSelf: 'center',
        marginBottom: 10
    },
    switchContainer: {
        flex: 1,
        backgroundColor: Colors.subTheme,
        paddingHorizontal: 5,
        borderRadius: width > 550 ? 32 : 25,
        height: width > 550 ? 67 : 50,
        alignItems: 'center',
        zIndex: 0
    }
});

export default HorizontalCalendar;