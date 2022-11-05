import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Animated } from 'react-native';
import { width } from '../utils/Scaling';
import { translateDown, translateUp, fadeIn, fadeOut } from '../utils/Animations';
import Slider from '@react-native-community/slider';
import SwitchSelector from 'react-native-switch-selector';
import Colors from '../utils/Colors';
import { useSelector } from 'react-redux';

import NumberInput from './NumberInput';
import CalendarButtons from './CalendarButtons';

const FrequencyOption = ({ option, frequencyType, setFrequencyType, frequencyValue1, frequencyValue2, setFrequencyValue1, setFrequencyValue2 }) => {
    const translation = useRef(new Animated.Value(0)).current;
    const fade = useRef(new Animated.Value(0)).current;

    const accentColor = useSelector(state => state.settings.accentColor);

    const [selectedDays, setSelectedDays] = useState('Everyday');

    let TouchableComp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableComp = TouchableNativeFeedback;
    }

    useEffect(() => {
        if (option === frequencyType) {
            if (option === 'Days_of_week') {
                updateSelectedDays(frequencyValue1);
            }
        }
    }, []);

    useEffect(() => {
        if (frequencyType === 'Days_of_week') {
            if (option === 'Days_of_week') {
                fadeIn(fade);
            } else {
                if (width > 550) { translateDown(translation, 90); }
                else { translateDown(translation); }
                fadeOut(fade);
            }
        } else if (frequencyType === 'Days_of_month') {
            if (option === 'Days_of_week') {
                fadeOut(fade);
            } else if (option === 'Days_of_month') {
                translateUp(translation);
                fadeIn(fade);
            } else {
                fadeOut(fade);
                if (width > 550) { translateDown(translation, 310); }
                else { translateDown(translation, 260); }
            }
        } else if (frequencyType === 'Repeat') {
            if (option === 'Days_of_week') {
                fadeOut(fade);
            } else if (option === 'Days_of_month') {
                translateUp(translation);
                fadeOut(fade)
            } else if (option === 'Repeat') {
                translateUp(translation);
                fadeIn(fade);
            } else {
                translateDown(translation, 70);
                fadeOut(fade);
            }
        } else if (frequencyType === 'X_days') {
            if (option === 'Days_of_week') {
                fadeOut(fade);
            } else if (option === 'Days_of_month') {
                translateUp(translation);
                fadeOut(fade)
            } else if (option === 'Repeat') {
                translateUp(translation);
                fadeOut(fade);
            } else {
                translateUp(translation);
                fadeIn(fade);
            }
        }
    }, [frequencyType]);

    const WeekdayButton = (day) => {
        let selected = false;
        for (let i = 0; i < frequencyValue1.length; i++) {
            if (day === frequencyValue1[i]) {
                selected = true;
            }
        }

        return (
            <TouchableOpacity
                onPress={() => updateDayArray(day, selected)}
                style={[styles.squareButtonContainer, {
                    backgroundColor: selected === true ? accentColor : Colors.subTheme
                }]}
            >
                <Text style={styles.buttonText}>{day[0]}</Text>
            </TouchableOpacity>
        );
    };

    const map = {
        'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 7
    };

    const updateDayArray = (day, selected) => {
        let newDayArray;

        // add day to list
        if (selected === false) {
            newDayArray = [...frequencyValue1, day].sort((a, b) => {
                return map[a] - map[b];
            });
            setFrequencyValue1(newDayArray);
        }
        // remove day from list
        else if (selected === true) {
            if (frequencyValue1.length == 1) {
                return;
            } else {
                newDayArray = frequencyValue1.filter(weekday => weekday != day);
                setFrequencyValue1(newDayArray);
            }
        }
        updateSelectedDays(newDayArray);
    };

    const updateSelectedDays = (dayArray) => {
        let weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        if (dayArray.length == 7) {
            setSelectedDays('Everyday');
        } else if (dayArray.length == 6) {
            for (let i = 0; i < dayArray.length; i++) {
                for (let j = 0; j < weekdays.length; j++) {
                    if (weekdays[j] === dayArray[i]) {
                        let tempArray = weekdays.filter(day => day != weekdays[j]);
                        weekdays = tempArray;
                    }
                }
            }
            setSelectedDays('Everyday except ' + weekdays[0]);
        } else if (dayArray[0] === 'Sat' && dayArray[1] === 'Sun') {
            setSelectedDays('Weekends');
        } else if (dayArray.length == 5 && dayArray[0] === 'Mon' && dayArray[1] === 'Tue' && dayArray[2] === 'Wed' && dayArray[3] === 'Thu' && dayArray[4] === 'Fri') {
            setSelectedDays('Weekdays');
        } else {
            let displayText = dayArray.join(', ');
            setSelectedDays(displayText);
        }
    };

    const IntervalInput = () => {
        if (frequencyValue1 === 'Week') {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, marginHorizontal: width > 550 ? 40 : 25 }}>
                    {NumberButton('1')}
                    {NumberButton('2')}
                    {NumberButton('3')}
                    {NumberButton('4')}
                    {NumberButton('5')}
                    {NumberButton('6')}
                </View>
            );
        } else if (frequencyValue1 === 'Month') {
            return (
                <Slider
                    style={{ width: '85%', height: 40, marginTop: 5, alignSelf: 'center', color: 'white' }}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    minimumTrackTintColor={accentColor}
                    maximumTrackTintColor='grey'
                    thumbTintColor='white'
                    value={parseInt(frequencyValue2)}
                    onValueChange={setFrequencyValue2}
                />
            );
        }
    };

    const NumberButton = (days) => {
        return (
            <TouchableOpacity
                onPress={() => setFrequencyValue2(days)}
                style={[styles.squareButtonContainer, {
                    backgroundColor: days == frequencyValue2 ? accentColor : Colors.lightTheme
                }]}
            >
                <Text style={styles.buttonText}>{days}</Text>
            </TouchableOpacity>
        );
    };

    const FrequencyInputs = () => {
        if (frequencyType === option) {
            if (option === 'Days_of_week') {
                return (
                    <View>
                        <Text style={styles.descriptionText}>{selectedDays}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, marginHorizontal: 15 }}>
                            {WeekdayButton('Sun')}
                            {WeekdayButton('Mon')}
                            {WeekdayButton('Tue')}
                            {WeekdayButton('Wed')}
                            {WeekdayButton('Thu')}
                            {WeekdayButton('Fri')}
                            {WeekdayButton('Sat')}
                        </View>
                    </View>
                );
            } else if (option === 'Days_of_month') {
                return (
                    <CalendarButtons
                        calendarDays={frequencyValue1}
                        setCalendarDays={setFrequencyValue1}
                    />
                );
            } else if (option === 'Repeat') {
                return (
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ color: Colors.lightGrey, marginTop: 45, fontSize: width > 550 ? 20 : 17 }}>Every</Text>
                        <NumberInput 
                            number={frequencyValue1} 
                            setNumber={setFrequencyValue1} 
                            style={{ marginTop: width > 550 ? 30 : 33, width: '25%', marginHorizontal: 10 }} 
                            max={3}
                            style2={{ height: width > 550 ? 60 : 50 }}
                        />
                        <Text style={{ color: Colors.lightGrey, marginTop: 45, fontSize: width > 550 ? 20 : 17 }}>days</Text>
                    </View>
                );
            } else if (option === 'X_days') {
                let time;
                if (frequencyValue2 == 1) { time = 'day' }
                else { time = 'days' }

                return (
                    <View>
                        <SwitchSelector
                            initial={frequencyValue1 === 'Week' ? 0 : 1}
                            onPress={(value) => {
                                if (frequencyValue2 > 6) { setFrequencyValue2(6); }
                                setFrequencyValue1(value);
                            }}
                            textColor={'white'}
                            buttonColor={accentColor}
                            fontSize={ width > 550 ? 20 : 17 }
                            backgroundColor={Colors.subTheme}
                            animationDuration={250}
                            options={[
                                { label: 'Week', value: 'Week' },
                                { label: 'Month', value: 'Month' }
                            ]}
                            height={50}
                            style={{ width: width > 550 ? '60%' : '70%', marginTop: 30, alignSelf: 'center' }}
                        />
                        <Text style={{ color: 'white', marginTop: 20, alignSelf: 'center', fontSize: width > 550 ? 18 : 15 }}>{frequencyValue2} {time} per {frequencyValue1 === 'Week' ? 'week' : 'month'}</Text>
                        {IntervalInput()}
                    </View>
                );
            }
        }
    };

    if (Platform.OS === 'ios') {
        return (
            <Animated.View style={{ zIndex: 1, transform: [{ translateY: translation }]}}>
                {option != 'Days_of_week' ? <View style={styles.border}/> : <View/>}
                <View style={styles.selectionContainer}>
                    <TouchableComp
                        onPress={() => setFrequencyType(option)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                            <View style={styles.circle}>
                                <View style={[styles.dot, {
                                    backgroundColor: option === frequencyType ? accentColor : null
                                }]}/>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.selectionText}>
                                    {option === 'Days_of_week' ? 'Specific days of the week' : null}
                                    {option === 'Days_of_month' ? 'Specific days of the month' : null}
                                    {option === 'Repeat' ? 'Repeat' : null}
                                    {option === 'X_days' ? 'X days per' : null}
                                </Text>
                            </View>
                        </View>
                    </TouchableComp>
                </View>
                <Animated.View style={[styles.inputContainer, { opacity: fade }]}>
                    {FrequencyInputs()}
                </Animated.View>
            </Animated.View>
        );
    } else {
        return (
            <View>
                <Animated.View style={{ zIndex: 1, transform: [{ translateY: translation }]}}>
                    {option != 'Days_of_week' ? <View style={styles.border}/> : <View/>}
                    <View style={styles.selectionContainer}>
                        <TouchableComp
                            onPress={() => setFrequencyType(option)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                                <View style={styles.circle}>
                                    <View style={[styles.dot, {
                                        backgroundColor: option === frequencyType ? accentColor : null
                                    }]}/>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.selectionText}>
                                        {option === 'Days_of_week' ? 'Specific days of the week' : null}
                                        {option === 'Days_of_month' ? 'Specific days of the month' : null}
                                        {option === 'Repeat' ? 'Repeat' : null}
                                        {option === 'X_days' ? 'X days per' : null}
                                    </Text>
                                </View>
                            </View>
                        </TouchableComp>
                    </View>
                </Animated.View>
                <Animated.View style={[styles.inputContainer, {
                    opacity: fade,
                    transform: [{ translateY: translation }]
                }]}>
                    {FrequencyInputs()}
                </Animated.View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    selectionContainer: {
        height: width > 550 ? 70 : 55,
        width: '87%',
        alignSelf: 'center'
    },
    border: {
        borderBottomColor: Colors.lightGrey,
        borderBottomWidth: Platform.OS === 'ios' ? 0.7 : 0.5,
        width: '100%',
        marginVertical: 10
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
    },
    selectionText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        fontFamily: 'roboto-medium'
    },
    descriptionText: {
        color: Colors.lightGrey,
        //marginLeft: 75
        marginLeft: width > 550 ? (width * 0.015 + 50) : (width * 0.065 + 50),
        fontSize: width > 550 ? 17 : 14  //<-- default fontSize
    },
    inputContainer: {
        position: 'absolute',
        top: width > 550 ? 60 : 50,
        width: width > 550 ? '90%' : '100%',
        alignSelf: 'center'
    },
    buttonText: {
        color: 'white',
        fontFamily: 'roboto-medium',
        fontSize: width > 550 ? 18 : 16
    },
    squareButtonContainer: {
        height: width > 550 ? 45 : 39,
        width: width > 550 ? 45 : 39,
        borderRadius: width > 550 ? 14 : 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default FrequencyOption;