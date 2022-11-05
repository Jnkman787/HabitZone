import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Animated } from 'react-native';
import { width } from '../utils/Scaling';
import { translateDown, translateUp, fadeIn, fadeOut } from '../utils/Animations';
import Slider from '@react-native-community/slider';
import Colors from '../utils/Colors';
import Toast from 'react-native-root-toast';
import { useSelector } from 'react-redux';

import StringInput from './StringInput';
import NumberInput from './NumberInput';
import { Ionicons } from '@expo/vector-icons';

const GoalOption = ({ option, description, goalType, setGoalType, goalValue1, goalValue2, setGoalValue1, setGoalValue2 }) => {
    const translation = useRef(new Animated.Value(0)).current;
    const fade = useRef(new Animated.Value(0)).current;
    const fade2 = useRef(new Animated.Value(0)).current;
    const fade3 = useRef(new Animated.Value(0)).current;
    const fade4 = useRef(new Animated.Value(0)).current;

    const [taskNum, setTaskNum] = useState(1);

    const accentColor = useSelector(state => state.settings.accentColor);

    let TouchableComp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableComp = TouchableNativeFeedback;
    }

    useEffect(() => {
        if (goalType === 'Off') {
            if (option === 'Amount') {
                fadeOut(fade);
            }
            if (option === 'Duration' || option === 'Checklist') {
                translateUp(translation);
                fadeOut(fade);
            }
        } else if (goalType === 'Amount') {
            if (option === 'Amount') {
                fadeIn(fade);
            } else if (option === 'Duration' || option === 'Checklist') {
                translateDown(translation, 90);
                fadeOut(fade);
            }
        } else if (goalType === 'Duration') {
            if (option === 'Amount') {
                fadeOut(fade);
            } else if (option === 'Duration') {
                translateUp(translation);
                fadeIn(fade);
            } else if (option === 'Checklist') {
                if (Platform.OS === 'ios') {
                    if (width > 550) { translateDown(translation, 170); } 
                    else { translateDown(translation, 160); }
                } else if (Platform.OS === 'android') {
                    if (width > 550) { translateDown(translation, 130); } 
                    else { translateDown(translation, 120); }
                }
                fadeOut(fade);
            }
        } else if (goalType === 'Checklist') {
            if (option === 'Amount') {
                fadeOut(fade);
            } else if (option === 'Duration') {
                translateUp(translation);
                fadeOut(fade);
            } else if (option === 'Checklist') {
                if (goalValue1[1]) {
                    fadeIn(fade2);
                    setTaskNum(2);
                    if (goalValue1[2]) {
                        fadeIn(fade3)
                        setTaskNum(3);
                        if (goalValue1[3]) {
                            fadeIn(fade4);
                            setTaskNum(4);
                        }
                    }
                }
                translateUp(translation);
                fadeIn(fade);
            }
        }
    }, [goalType]);

    const DurationSlider = (timespan) => {
        let time;
        if (timespan === 'Hours') {
            if (goalValue1 == 1) { time = goalValue1 + ' hour' }
            else { time = goalValue1 + ' hours' }
        } else if (timespan === 'Minutes') {
            if (goalValue2 == 1) { time = goalValue2 + ' minute' }
            else { time = goalValue2 + ' minutes'}
        }

        return (
            <View>
                <Text style={{ color: 'white', alignSelf: 'center', marginTop: 10, fontSize: width > 550 ? 18 : 15 }}>{time}</Text>
                <Slider
                    style={{ width: '85%', alignSelf: 'center', marginTop: 10 }}
                    minimumValue={0}
                    maximumValue={timespan === 'Hours' ? 23 : 59}
                    step={1}
                    minimumTrackTintColor={accentColor}
                    maximumTrackTintColor='grey'
                    thumbTintColor='white'
                    value={timespan === 'Hours' ? parseInt(goalValue1) : parseInt(goalValue2)}
                    //onValueChange={timespan === 'Hours' ? setGoalValue1 : setGoalValue2}
                    onValueChange={value => {
                        clearTimeout(x);
                        let x = setTimeout(() => {
                            timespan === 'Hours' ? setGoalValue1(value) : setGoalValue2(value)
                        }, 20)
                    }}
                    //onSlidingComplete={timespan === 'Hours' ? setGoalValue1 : setGoalValue2}
                />
            </View>
        );
    };

    const AdditionalSubtask = (index, fadeNum, prevFadeNum) => {
        if (taskNum == index) {
            return (
                <Animated.View style={{ opacity: prevFadeNum }}>
                    <TouchableOpacity
                        style={[styles.addButtonCircle, { backgroundColor: accentColor }]}
                        onPress={() => {
                            if (goalValue1[index - 1]) {
                                setTaskNum(index + 1);
                                fadeIn(fadeNum);
                            } else {
                                Toast.show('Please enter your subtask before adding another', {
                                    backgroundColor: Colors.darkGrey,
                                    shadow: false,
                                    textStyle: { fontSize: width > 550 ? 19 : 16 }
                                });
                            }
                        }}
                    >
                        <Ionicons name='add' size={30} color='white' style={styles.plusSign}/>
                    </TouchableOpacity>
                </Animated.View>
            );
        } else if ( taskNum > index ) {
            return (
                <Animated.View style={{ opacity: fadeNum }}>
                    <StringInput string={goalValue1[index]} label='Subtask' setText={text => changeArray(text, index)} style={{ marginTop: 20 }} length={25}/>
                </Animated.View>
            );
        }
    };

    const changeArray = (newText, index) => {
        let newArray = [...goalValue1];
        newArray[index] = newText;
        setGoalValue1(newArray);
    };

    const GoalInputs = () => {
        if (goalType === option) {
            if (option === 'Amount') {
                return (
                    <View style={styles.AmountLayout}>
                        <NumberInput number={goalValue1} label='Target' setNumber={setGoalValue1} style={{ marginTop: 20, width: '30%' }} max={3}/>
                        <StringInput string={goalValue2} label='Unit (optional)' setText={setGoalValue2} style={{ marginTop: 20, width: '55%' }} length={15}/>
                    </View>
                );
            } else if (option === 'Duration') {
                return (
                    <View>
                        {DurationSlider('Hours')}
                        {DurationSlider('Minutes')}
                    </View>
                );
            } else if (option === 'Checklist') {
                return (
                    <View>
                        <StringInput string={goalValue1[0]} label='Subtask' setText={text => changeArray(text, 0)} style={{ marginTop: 20 }} length={25}/>
                        {AdditionalSubtask(1, fade2, fade)}
                        {AdditionalSubtask(2, fade3, fade2)}
                        {AdditionalSubtask(3, fade4, fade3)}
                    </View>
                );
            }
        }
    };

    if (Platform.OS === 'ios') {
        return (
            <Animated.View style={{ transform: [{ translateY: translation }]}}>
                {option != 'Off' ? <View style={styles.border}/> : <View/>}
                <View style={styles.selectionContainer}>
                    <TouchableComp
                        onPress={() => setGoalType(option)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                            <View style={styles.circle}>
                                <View style={[styles.dot, {
                                    backgroundColor: option === goalType ? accentColor : null
                                }]}/>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.selectionText}>{option}</Text>
                                <Text style={styles.descriptionText}>{description}</Text>
                            </View>
                        </View>
                    </TouchableComp>
                </View>
                <Animated.View style={[styles.inputContainer, { opacity: fade }]}>
                    {GoalInputs()}
                </Animated.View>
            </Animated.View>
        );
    } else {
        return (
            <View>
                <Animated.View style={{ transform: [{ translateY: translation }]}}>
                    {option != 'Off' ? <View style={styles.border}/> : <View/>}
                    <View style={styles.selectionContainer}>
                        <TouchableComp
                            onPress={() => setGoalType(option)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                                <View style={styles.circle}>
                                    <View style={[styles.dot, {
                                        backgroundColor: option === goalType ? accentColor : null
                                    }]}/>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.selectionText}>{option}</Text>
                                    <Text style={styles.descriptionText}>{description}</Text>
                                </View>
                            </View>
                        </TouchableComp>
                    </View>
                </Animated.View>
                <Animated.View style={[styles.inputContainer, {
                    opacity: fade,
                    transform: [{ translateY: translation }]
                }]}>
                    {GoalInputs()}
                </Animated.View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    selectionContainer: {
        height: width > 550 ? 90 : 75,
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
        fontFamily: 'roboto-medium',
        marginBottom: 5
    },
    descriptionText: {
        color: Colors.lightGrey,
        fontSize: width > 550 ? 17 : 14
    },
    inputContainer: {
        position: 'absolute',
        top: width > 550 ? 105 : 90,
        width: width > 550 ? '90%' : '100%',
        alignSelf: 'center'
    },
    addButtonCircle: {
        height: width > 550 ? 45 : 40,
        width: width > 550 ? 45 : 40,
        borderRadius: width > 550 ? 23 : 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    plusSign: {
        left: 1
    },
    AmountLayout: {
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default GoalOption;