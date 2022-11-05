import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { width } from '../../utils/Scaling';
import Modal from 'react-native-modal';
import Colors from '../../utils/Colors';
import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';

import FrequencyOption from '../../components/FrequencyOption';
import { setFrequency } from '../../store/setupSlice';

const FrequencyScreen = ({ navigation, route }) => {
    const { type } = route.params;
    const frequency = useSelector(state => state.setup.frequency);
    const accentColor = useSelector(state => state.settings.accentColor);

    const [frequencyType, setFrequencyType] = useState(frequency.type);
    const [weekdays, setWeekdays] = useState(frequency.weekdays ? frequency.weekdays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    const [calendarDays, setCalendarDays] = useState(frequency.calendarDays ? frequency.calendarDays : []);
    const [repetition, setRepetition] = useState(frequency.repetition ? frequency.repetition : '2');
    const [interval, setInterval] = useState(frequency.interval ? frequency.interval : 'Week');
    const [number, setNumber] = useState(frequency.number ? frequency.number : '6');
    const [modalVisible, setModalVisible] = useState(false);

    const dispatch = useDispatch();

    const checkCalendarDays = () => {
        if (calendarDays.length > 0) {
            dispatch(setFrequency({frequencyType, calendarDays}));
            navigation.goBack();
        } else {
            Toast.show('Please select at least one day', {
                backgroundColor: Colors.darkGrey,
                shadow: false,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        }
    };

    const checkRepeat = () => {
        if (/^\d+$/.test(repetition)) {
            if (repetition > 1) {
                dispatch(setFrequency({frequencyType, repetition}));
                navigation.goBack();
            } else {
                Toast.show('Please enter a number of days greater than 1', {
                    backgroundColor: Colors.darkGrey,
                    shadow: false,
                    textStyle: { fontSize: width > 550 ? 19 : 16 }
                });
            }
        } else {
            Toast.show('Please enter a number for the number of days', {
                backgroundColor: Colors.darkGrey,
                shadow: false,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        }
    };

    const setFrequencyParams = () => {
        if (frequencyType === 'Days_of_week') {
            dispatch(setFrequency({frequencyType, weekdays}));
            navigation.goBack();
        } else if (frequencyType === 'Days_of_month') {
            checkCalendarDays();
        } else if (frequencyType === 'Repeat') {
            checkRepeat();
        } else if (frequencyType === 'X_days') {
            dispatch(setFrequency({frequencyType, interval, number}));
            navigation.goBack();
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={[styles.headerRightContainer, { backgroundColor: accentColor }]}
                    onPress={() => {
                        if (type === 'Add') { setFrequencyParams(); }
                        else if (type === 'Edit') { setModalVisible(true); }
                    }}
                >
                    <Text style={styles.headerText}>SAVE</Text>
                </TouchableOpacity>
            ) 
        })
    }, [frequencyType, weekdays, calendarDays, repetition, interval, number]);

    return (
        <View style={styles.screen}>
            <FrequencyOption
                option='Days_of_week'
                frequencyType={frequencyType}
                setFrequencyType={setFrequencyType}
                frequencyValue1={weekdays}
                setFrequencyValue1={setWeekdays}
            />
            <FrequencyOption
                option='Days_of_month'
                frequencyType={frequencyType}
                setFrequencyType={setFrequencyType}
                frequencyValue1={calendarDays}
                setFrequencyValue1={setCalendarDays}
            />
            <FrequencyOption
                option='Repeat'
                frequencyType={frequencyType}
                setFrequencyType={setFrequencyType}
                frequencyValue1={repetition}
                setFrequencyValue1={setRepetition}
            />
            <FrequencyOption
                option='X_days'
                frequencyType={frequencyType}
                setFrequencyType={setFrequencyType}
                frequencyValue1={interval}
                setFrequencyValue1={setInterval}
                frequencyValue2={number}
                setFrequencyValue2={setNumber}
            />

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationInTiming={1}
                animationOutTiming={1}
                backdropOpacity={0.45}
            >
                <View style={styles.modalContainer}>
                    <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 15 }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 20 : 17, textAlign: 'center' }}>
                            Confirm this new frequency?
                        </Text>
                        <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                            A new frequency will be set, altering the tracking of statistics starting on today's date going forward
                        </Text>
                        <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                            Past recorded data will still be available but will be based on the previous set frequency/frequencies
                        </Text>
                        <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                            This action can be undone by setting the frequency back to its current value on the same day it was changed
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderColor: 'white' }}>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center', borderTopWidth: width > 550 ? 1 : 0.75, borderTopColor: 'white' }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <View style={{ width: width > 550 ? 1 : 0.5, height: 50, backgroundColor: 'white' }}/>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', height: 50, backgroundColor: accentColor, borderBottomRightRadius: 20, 
                                borderTopColor: 'white', borderTopWidth: width > 550 ? 1 : 0.75, borderLeftWidth: 0.5, borderLeftColor: 'white'
                            }}
                            onPress={() => {
                                setFrequencyParams();
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

FrequencyScreen.navigationOptions = ({ route }) => {
    const { headerRight } = route.params;

    return {
        title: 'How often?',
        headerTitleAlign: 'center',
        headerRight
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme,
        paddingTop: 30
    },
    headerRightContainer: {
        right: 25,
        borderRadius: 12,
        top: 1
    },
    headerText: {
        color: 'white',
        fontSize: width > 550 ? 17 : 15,
        fontFamily: 'roboto-medium',
        marginVertical: 6,
        marginHorizontal: 10
    },
    modalContainer: {
        backgroundColor: Colors.subTheme,
        width: width > 550 ? '80%' : '90%',
        alignSelf: 'center',
        borderRadius: 20,
        height: width > 550 ? 270 : 285
    },
    modalButtonText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        alignSelf: 'center',
        fontFamily: 'roboto-medium'
    }
});

export default FrequencyScreen;