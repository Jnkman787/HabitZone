import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';

import { AntDesign } from '@expo/vector-icons';

const TransferOption = ({ navigation, option, selectedValue, screenType }) => {
    const [label, setLabel] = useState(null);

    const checkOptionNavigation = () => {
        if (option === 'Category') {
            navigation.navigate('HabitStack', { screen: 'Category' });
        } else if (option === 'Goal') {
            navigation.navigate('HabitStack', { screen: 'Goal', params: { type: screenType } });
        } else if (option === 'Frequency') {
            navigation.navigate('HabitStack', { screen: 'Frequency', params: { type: screenType } });
        }
    };

    const setTransferLabel = () => {
        if (option === 'Goal') {
            if (selectedValue.type === 'Amount') {
                if (selectedValue.unit) {
                    setLabel(selectedValue.target + ' ' + selectedValue.unit);
                } else { setLabel(selectedValue.target); }
            } else if (selectedValue.type === 'Duration') {
                if (selectedValue.hours > 0) {
                    if (selectedValue.minutes > 0) {
                        setLabel(selectedValue.hours + 'h ' + selectedValue.minutes + 'min');
                    } else {
                        setLabel(selectedValue.hours + 'h');
                    }
                } else {
                    setLabel(selectedValue.minutes + 'min');
                }
            } else { setLabel(selectedValue.type) }

        } else if (option === 'Frequency') {
            if (selectedValue.type === 'Days_of_week') {
                checkFrequencyDayLabel(selectedValue.weekdays);
            } else if (selectedValue.type === 'Days_of_month') {
                let displayText;
                let dayArray = selectedValue.calendarDays;
                if (dayArray.length > 3) {
                    for (let i = 3; i < selectedValue.calendarDays.length; i++) {
                        dayArray = dayArray.filter(day => day != selectedValue.calendarDays[i]);
                    }
                    displayText = dayArray.join(', ') + '...';
                } else {
                    displayText = dayArray.join(', ');
                }
                setLabel('Fixed days: ' + displayText);
            } else if (selectedValue.type === 'Repeat') {
                setLabel('Every ' + selectedValue.repetition + ' days');
            } else if (selectedValue.type === 'X_days') {
                if (selectedValue.interval === 'Week') {
                    if (selectedValue.number > 1) {
                        setLabel(selectedValue.number + ' days per week');
                    } else {
                        setLabel(selectedValue.number + ' day per week');
                    }
                } else {
                    if (selectedValue.number > 1) {
                        setLabel(selectedValue.number + ' days per month'); 
                    } else {
                        setLabel(selectedValue.number + ' day per month'); 
                    }
                }
            }

        } else {
            setLabel(selectedValue);
        }
    };

    const checkFrequencyDayLabel = (dayArray) => {
        let weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        if (dayArray.length == 7) {
            setLabel('Everyday');
        } else if (dayArray.length == 6) {
            for (let i = 0; i < dayArray.length; i++) {
                for (let j = 0; j < weekdays.length; j++) {
                    if (weekdays[j] === dayArray[i]) {
                        let tempArray = weekdays.filter(day => day != weekdays[j]);
                        weekdays = tempArray;
                        break;
                    }
                }
            }
            setLabel('Everyday except ' + weekdays[0]);
        } else if (dayArray[0] === 'Sat' && dayArray[1] === 'Sun') {
            setLabel('Weekends');
        } else if (dayArray.length == 5 && dayArray[0] === 'Mon' && dayArray[1] === 'Tue' && dayArray[2] === 'Wed' && dayArray[3] === 'Thu' && dayArray[4] === 'Fri') {
            setLabel('Weekdays');
        } else {
            let displayText = [];
            let tempArray = dayArray;
            if (dayArray.length > 3) {
                for (let i = 3; i < dayArray.length; i++) {
                    tempArray = tempArray.filter(day => day != dayArray[i]);
                }
                displayText = tempArray.join(', ') + '...';
            } else {
                displayText = tempArray.join(', ');
            }
            setLabel(displayText);
        }
    };

    useEffect(() => {
        setTransferLabel();
    }, [selectedValue]);

    return (
        <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => checkOptionNavigation()}
        >
            <Text style={styles.optionText}>{option}</Text>
            <View style={styles.rightLayout}>
                <Text style={styles.selectedText}>{label}</Text>
                <AntDesign name='right' size={21} color='white' style={{ top: 1 }}/>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    optionContainer: {
        backgroundColor: Colors.subTheme,
        borderRadius: 15,
        alignSelf: 'center',
        height: width > 550 ? 65 : 55,
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
        fontSize: width > 550 ? 20 : 17,
        marginRight: 15
    }
});

export default TransferOption;