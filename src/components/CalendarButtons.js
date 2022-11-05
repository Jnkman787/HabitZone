import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';
import { useSelector } from 'react-redux';

const CalendarButtons = ({ calendarDays, setCalendarDays }) => {
    const accentColor = useSelector(state => state.settings.accentColor);

    const CalendarButton = (calendarNumber) => {
        let selected = false;
        for (let i = 0; i < calendarDays.length; i++) {
            if (calendarNumber === calendarDays[i]) {
                selected = true;
            }
        }

        return (
            <TouchableOpacity
                onPress={() => updateCalendarDays(calendarNumber, selected)}
                style={[styles.buttonContainer, {
                    backgroundColor: selected === true ? accentColor : Colors.subTheme
                }]}
            >
                <Text style={styles.buttonText}>{calendarNumber}</Text>
            </TouchableOpacity>
        );
    };

    const updateCalendarDays = (calendarNumber, selected) => {
        let newCalendaryArray;

        // add day to list
        if (selected === false) {
            newCalendaryArray = [...calendarDays, calendarNumber].sort((a, b) => a > b ? 1 : -1);
            setCalendarDays(newCalendaryArray);
        }
        // remove day from list
        else if (selected === true) {
            newCalendaryArray = calendarDays.filter(number => number != calendarNumber);
            setCalendarDays(newCalendaryArray);
        }
    };

    const CalendarButtonRow = (rowSize, value1, value2, value3, value4, value5, value6, value7) => {
        if (rowSize == 7) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                    {CalendarButton(value1)}
                    {CalendarButton(value2)}
                    {CalendarButton(value3)}
                    {CalendarButton(value4)}
                    {CalendarButton(value5)}
                    {CalendarButton(value6)}
                    {CalendarButton(value7)}
                </View>
            );
        } else if (rowSize == 3) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                    {CalendarButton(value1)}
                    {CalendarButton(value2)}
                    {CalendarButton(value3)}
                </View>
            );
        }
    };
    
    return (
        <View style={{ marginTop: 20 }}>
            {CalendarButtonRow(7, 1, 2, 3, 4, 5, 6, 7)}
            {CalendarButtonRow(7, 8, 9, 10, 11, 12, 13, 14)}
            {CalendarButtonRow(7, 15, 16, 17, 18, 19, 20, 21)}
            {CalendarButtonRow(7, 22, 23, 24, 25, 26, 27, 28)}
            {CalendarButtonRow(3, 29, 30, 31)}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        height: width > 550 ? 45 : 35,
        width: width > 550 ? 45 : 35,
        marginHorizontal: width > 550 ? 12 : 6,
        borderRadius: width > 550 ? 15 : 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontFamily: 'roboto-medium',
        fontSize: width > 550 ? 18 : 16
    }
});

export default CalendarButtons;