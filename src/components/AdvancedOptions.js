import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Switch, Platform, TouchableOpacity, Linking } from 'react-native';
import { width, verticalScale, scale } from '../utils/Scaling';
import { List } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import DatePicker from 'react-native-modern-datepicker';
import Modal from 'react-native-modal';
import Colors from '../utils/Colors';
import Toast from 'react-native-root-toast';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';
import { setStartDate, setEndDate, setNotifications } from '../store/setupSlice';

import NumberInput from './NumberInput';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const AdvancedOptions = ({ scrollView, type, currentHabit }) => {
    const [endDateEnabled, setEndDateEnabled] = useState();
    const [notificationsEnabled, setNotificationsEnabled] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modal3Visible, setModal3Visible] = useState(false);
    const [dateType, setDateType] = useState('start');
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [startText, setStartText] = useState('Today');
    const [endText, setEndText] = useState('');
    const [days, setDays] = useState('30');
    const [hours, setHours] = useState(9);
    const [minutes, setMinutes] = useState(0);
    const [timeText, setTimeText] = useState('');
    const referenceDate = useRef();

    const startDate = useSelector(state => state.setup.startDate);
    const endDate = useSelector(state => state.setup.endDate);
    //const notifications = useSelector(state => state.setup.notifications);

    const accentColor = useSelector(state => state.settings.accentColor);

    const dispatch = useDispatch();

    const setupDateForPicker = (date) => {
        let pickerDate;

        if (date.getMonth() < 9) {
            if (date.getDate() < 10) {
                pickerDate = date.getFullYear() + '/0' + (date.getMonth() + 1) + '/0' + date.getDate();
            } else {
                pickerDate = date.getFullYear() + '/0' + (date.getMonth() + 1) + '/' + date.getDate();
            }
        } else if (date.getDate() < 10) {
            pickerDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/0' + date.getDate();
        } else {
            pickerDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
        }

        return pickerDate;
    };

    const getTimeText = () => {
        let formattedTime;

        if (hours <= 9) {
            if (minutes <= 9) {
                formattedTime = '0' + String(hours) + ':0' + String(minutes);
            } else {
                formattedTime = '0' + String(hours) + ':' + String(minutes);
            }
        } else {
            if (minutes <= 9) {
                formattedTime = String(hours) + ':0' + String(minutes);
            } else {
                formattedTime = String(hours) + ':' + String(minutes);
            }
        }

        return formattedTime;
    };
    
    const checkNotificationStatus = async () => {
        let check = await Notifications.getPermissionsAsync();
        if (check.status != 'granted') {
            setModal3Visible(true);
        }
    };

    useEffect(() => {
        if (type === 'Add') {
            setEndDateEnabled(false);
            setNotificationsEnabled(false);
        } else if (type === 'Edit') {
            // set start text
            let today = setupDateForPicker(new Date());
            let currentStartDate = currentHabit.startDate;
            if (currentStartDate === today) {
                setStartText('Today');
            } else { setStartText(currentStartDate); }

            if (currentHabit.endDate != null) {
                // enable end date & set days
                setEndDateEnabled(true);

                // adjust hours for start date so as to properly calculate the # of days
                let tempStartDate = new Date(currentHabit.startDate);

                // calculate the time difference of the start and end date
                let numDays = new Date(currentHabit.endDate).getTime() - tempStartDate.getTime();
                // calculate the # of days the end date takes place after the start date
                numDays = Math.round(numDays / (1000 * 3600 * 24));
                setDays(numDays.toString());
            } else {
                setEndDateEnabled(false);
            }

            if (currentHabit.notifications.enabled === true) {
                setNotificationsEnabled(true);
                let timeHours = currentHabit.notifications.time.substring(0, 2); 
                let timeMinutes = currentHabit.notifications.time.substring(3, 5);
                
                // set hours 
                if (timeHours.substring(0, 1) === '0') { setHours(parseInt(timeHours.substring(1))); }
                else { setHours(parseInt(timeHours)); }

                // set minutes
                if (timeMinutes.substring(0, 1) === '0') { setMinutes(parseInt(timeMinutes.substring(1))); }
                else { setMinutes(parseInt(timeMinutes)); }
            } else {
                setNotificationsEnabled(false);
            }
        }
    }, []);

    useEffect(() => {
        if (endDateEnabled === true) {
            // setup end date value & text
            let newEndDate = new Date(startDate);
            newEndDate.setDate(newEndDate.getDate() + parseInt(days));
            dispatch(setEndDate(setupDateForPicker(newEndDate)));
            setEndText(setupDateForPicker(newEndDate));
        } else if (endDateEnabled === false) {
            // reset end date value & text
            dispatch(setEndDate(null));
            setEndText('');

            if (type === 'Edit') {
                // check if start date is after today's date
                let today = new Date();
                let tempStartDate = new Date(startDate);
                today.setHours(0, 0, 0, 0);

                let time = today.getTime() - tempStartDate.getTime();
                if (time < 0) {
                    // set # of days to 30 days from start date
                    setDays('30');
                } else {
                    // set # of days to 30 days from today
                    let futureDate = new Date();
                    futureDate.setHours(0, 0, 0, 0);
                    futureDate.setDate(futureDate.getDate() + 30);

                    let numDays = futureDate.getTime() - tempStartDate.getTime();
                    numDays = Math.round(numDays / (1000 * 3600 * 24));
                    setDays(numDays.toString());
                }
            } else {
                // set # of days to 30 days from start date
                setDays('30');
            }   
        }
    }, [endDateEnabled]);

    useEffect(() => {
        if (notificationsEnabled === true) {
            // setup/update notifications value and time text
            dispatch(setNotifications({enabled: true, time: getTimeText()}));
            setTimeText(getTimeText());
        } else if (notificationsEnabled === false) {
            // reset notifications value and time text
            dispatch(setNotifications({enabled: false, time: null}));
            setTimeText('');
            setHours(9);
            setMinutes(0);
        }
    }, [notificationsEnabled, hours, minutes]);

    // setup/update date type, max date, min date, and reference date for date picker
    const setupDateType = (setupType) => {
        setDateType(setupType);

        if (setupType === 'start') {
            // min date = today
            setMinDate(setupDateForPicker(new Date()));

            if (endDate === null) {
                setMaxDate(null);
            } else {
                // max date = day before end date
                let tempMaxDate = new Date(endDate);
                tempMaxDate.setDate(tempMaxDate.getDate() - 1);
                setMaxDate(setupDateForPicker(tempMaxDate));
            }
            referenceDate.current = startDate;

        } else if (setupType === 'end') {
            // no max date
            setMaxDate(null);

            if (type === 'Add') {
                // min date = day after start date
                let tempMinDate = new Date(startDate);
                tempMinDate.setDate(tempMinDate.getDate() + 1);
                setMinDate(setupDateForPicker(tempMinDate));
            } else if (type === 'Edit') {
                // check if start date is before today's date
                // if yes: min date = today
                // if no: min date = day after start date

                // check if the # of milliseconds is within 24 hours
                // if it is, check if the getDate() value is the same
                let time = new Date().getTime() - new Date(startDate).getTime();
                if (time <= 86400000) {
                    if (new Date().getDate() === new Date(startDate).getDate()) {
                        // start date is today
                        let tempMinDate = new Date(startDate);
                        tempMinDate.setDate(tempMinDate.getDate() + 1);
                        setMinDate(setupDateForPicker(tempMinDate));
                    } else if (time < 0) { 
                        // start date is after today's date
                        let tempMinDate = new Date(startDate);
                        tempMinDate.setDate(tempMinDate.getDate() + 1);
                        setMinDate(setupDateForPicker(tempMinDate));
                    } else {
                        // start date is before today's date
                        setMinDate(setupDateForPicker(new Date()));
                    }
                } else {
                    // start date is before today's date
                    setMinDate(setupDateForPicker(new Date()));
                }
            }       

            referenceDate.current = endDate;
        }
    };

    // update end date & text based on entered number of days
    const updateNumDays = (numDays) => {
        // prevent user from entering a decimal, a negative number or a value of zero
        if (String(numDays)[0] != 0 && String(numDays)[0] != '-' && String(numDays)[0] != '.') {
            setDays(numDays.toString());
            if (numDays != '') {
                let newEndDate = new Date(startDate);
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                newEndDate.setDate(newEndDate.getDate() + parseInt(numDays));

                // check if the entered value set's the end date to before today's date
                let time = newEndDate.getTime() - today.getTime();
                if (time > -86400000) {
                    if (time > 0) {
                        dispatch(setEndDate(setupDateForPicker(newEndDate)));
                        setEndText(setupDateForPicker(newEndDate));
                    } else if (newEndDate.getDate() === new Date().getDate()) {
                        dispatch(setEndDate(setupDateForPicker(newEndDate)));
                        setEndText(setupDateForPicker(newEndDate));
                    }
                } else {
                    if (type === 'Edit') {
                        Toast.show('Please enter a number of days that sets the end date to no earlier than today', {
                            backgroundColor: Colors.darkGrey,
                            position: Toast.positions.CENTER,
                            opacity: 1,
                            shadow: false,
                            visibilityTime: 7000,
                            autoHide: true,
                            textStyle: { fontSize: width > 550 ? 19 : 16 }
                        });
                    }
                }
            } else {
                Toast.show('\n Please enter a number \n', {
                    backgroundColor: Colors.darkGrey,
                    position: Toast.positions.CENTER,
                    opacity: 1,
                    shadow: false,
                    visibilityTime: 2000,
                    autoHide: true,
                    textStyle: { fontSize: width > 550 ? 19 : 16 }
                });
            }
        }
    };

    const setSelectedDate = (date) => {
        // check if it's setting the start date or end date
        if (date === referenceDate.current) {
            return;
        } else {
            referenceDate.current = date;
            if (dateType === 'start') {
                let newStartDate = new Date(date);
                dispatch(setStartDate(date));
                setModalVisible(false);
                
                if (date === setupDateForPicker(new Date())) {
                    setStartText('Today');
                } else { setStartText(date); }

                if (endDate != null) {
                    let tempEndDate = new Date(endDate);

                    // calculate the time difference of the start and end date
                    let numDays = tempEndDate.getTime() - newStartDate.getTime();
                    // calculate the # of days the end date takes place after the start date
                    numDays = Math.round(numDays / (1000 * 3600 * 24));
                    setDays(numDays.toString());
                }

            } else if (dateType === 'end') {
                let newEndDate = new Date(date);
                setModalVisible(false);

                // adjust hours for start date so as to properly calculate the # of days
                let tempStartDate = new Date(startDate);

                let numDays = newEndDate.getTime() - tempStartDate.getTime();
                numDays = Math.round(numDays / (1000 * 3600 * 24));

                // check if numDays is greater than 9999
                if (numDays > 9999) {
                    Toast.show('\n Please selected an end date no greater than 9999 days away from the start date \n', {
                        backgroundColor: Colors.darkGrey,
                        position: Toast.positions.CENTER,
                        opacity: 1,
                        shadow: false,
                        //visibilityTime: 40000,
                        textStyle: { fontSize: width > 550 ? 19 : 16 }
                    });
                } else {
                    setDays(numDays.toString());
                    dispatch(setEndDate(date));
                    setEndText(date);
                }
            }
        }
    };

    return (
        <View>
            <List.Section>
                <List.Accordion
                    title='Advanced Options'
                    titleStyle={{ color: 'white', fontSize: width > 550 ? 20 : 18, fontWeight: 'bold' }} 
                    onPress={() => {
                        setTimeout(() => {
                            scrollView.current.scrollToEnd({ animated: true });
                        }, 50);
                    }}
                    theme={{ colors: { text: 'white' } }}
                    style={{ backgroundColor: Colors.theme, paddingHorizontal: width > 550 ? '10%' : '5%' }}
                >
                    <List.Item
                        title='Start date'
                        left={() => <MaterialCommunityIcons name='calendar-today' size={28} color='white' style={[styles.iconLayout, { top: width > 550 ? 15 : 9 }]}/>}
                        right={() => (
                            <TouchableOpacity 
                                style={{ height: width > 550 ? 45 : 40, 
                                    justifyContent: 'center', 
                                    backgroundColor: Colors.theme, 
                                    borderRadius: 5, 
                                    marginRight: '2%', 
                                    marginTop: width > 550 ? 8 : 2 
                                }}
                                onPress={() => {
                                    if (type == 'Add') {
                                        setupDateType('start');
                                        setModalVisible(true);
                                    }
                                }}
                            >
                                <Text style={{ color: 'white', fontSize: width > 550 ? 20 : 17, marginHorizontal: 10 }}>{startText}</Text>
                            </TouchableOpacity>
                        )}
                        titleStyle={[styles.advancedOptionText, { top: width > 550 ? 5 : 2 }]}
                        style={styles.startDateContainer}
                    />
                    <List.Item
                        title='End date'
                        left={() => <MaterialCommunityIcons name='calendar' size={28} color='white' style={[styles.iconLayout, { top: 9 }]}/>}
                        right={() => 
                            <Switch
                                value={endDateEnabled}
                                trackColor={{ false: 'grey', true: accentColor}}
                                thumbColor={'white'}
                                onValueChange={() => {
                                    setEndDateEnabled(previousState => !previousState);
                                    setTimeout(() => {
                                        scrollView.current.scrollToEnd({ animated: true });
                                    }, 50);
                                }}
                                style={{ top: Platform.OS === 'ios' ? 6 : 0, right: '25%', transform: width > 550 ? [{ scaleX: 1.3 }, { scaleY: 1.3 }] : [] }}
                            />
                        }
                        titleStyle={[styles.advancedOptionText, { top: Platform.OS === 'ios' ? 6 : 0 }]}
                        style={styles.endDateContainer}
                    />
                    {endDateEnabled === false ? null :
                        <List.Item
                            left={() => (
                                <TouchableOpacity 
                                    style={{ height: width > 550 ? 45 : 40, 
                                        justifyContent: 'center', 
                                        backgroundColor: Colors.theme, 
                                        borderRadius: 5, 
                                        marginLeft: width > 550 ? '15%' : '10%', 
                                        top: width > 550 ? 10 : 5 
                                    }}
                                    onPress={() => {
                                        setupDateType('end');
                                        setModalVisible(true);
                                    }}
                                >
                                    <Text style={{ color: 'white', fontSize: width > 550 ? 20 : 17, marginHorizontal: 10 }}>{endText}</Text>
                                </TouchableOpacity>
                            )}
                            right={() => (
                                <View style={{ flexDirection: 'row', alignItems: 'center', right: width > 550 ? '13%' : '8%', top: width > 550 ? 10 : 5 }}>
                                    <NumberInput number={days} setNumber={value => updateNumDays(value)} 
                                        style={{ width: width > 550 ? 95 : 75, marginTop: 0, marginRight: 10 }} 
                                        style2={{ height: width > 550 ? 45 : 40 }}
                                        max={4}
                                        onExit={setTimeout(() => {
                                            scrollView.current.scrollToEnd({ animated: true });
                                        }, 0)}
                                    />
                                    <Text style={{ color: 'white', fontSize: width > 550 ? 20 : 17 }}>days</Text>
                                </View>
                            )}
                            style={styles.endDateSelectionContainer}
                        />
                    }
                    <List.Item
                        title='Notifications'
                        left={() => <Ionicons name='notifications-outline' size={28} color='white' style={[styles.iconLayout, { top: 9 }]}/>}
                        right={() => 
                            <Switch
                                value={notificationsEnabled}
                                trackColor={{ false: 'grey', true: accentColor}}
                                thumbColor={'white'}
                                onValueChange={() => {
                                    if (notificationsEnabled === false) {
                                        // user is now enabling notifications to true
                                        // check if notifications for the app are enabled in the settings of the user's phone
                                        // if not, display the alert inform them to turn the notifications on
                                        checkNotificationStatus();
                                    }
                                    setNotificationsEnabled(previousState => !previousState);
                                    setTimeout(() => {
                                        scrollView.current.scrollToEnd({ animated: true });
                                    }, 50);
                                }}
                                style={{ top: Platform.OS === 'ios' ? 6 : 0, right: '25%', transform: width > 550 ? [{ scaleX: 1.3 }, { scaleY: 1.3 }] : [] }}
                            />
                        }
                        titleStyle={[styles.advancedOptionText, { top: Platform.OS === 'ios' ? 6 : 0 }]}
                        style={[styles.notificationsContainer, {
                            borderBottomLeftRadius: notificationsEnabled === false ? 20 : 0,
                            borderBottomRightRadius: notificationsEnabled === false ? 20 : 0,
                        }]}
                    />
                    {notificationsEnabled === false ? null :
                        <List.Item
                            left={() => (
                                <TouchableOpacity
                                    style={{ height: width > 550 ? 45 : 40, 
                                        width: width > 550 ? 150 : 110, 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        backgroundColor: Colors.theme, 
                                        borderRadius: 5, 
                                        bottom: 5, 
                                        marginLeft: width > 550 ? '35%' : '32.5%'
                                    }}
                                    onPress={() => {
                                        setModal2Visible(true);
                                    }}
                                >
                                    <Text style={{ color: 'white', fontSize: width > 550 ? 20 : 17, marginHorizontal: 10 }}>{timeText}</Text>
                                </TouchableOpacity>
                            )}
                            style={styles.notificationsSelectionContainer}
                        />
                    }
                </List.Accordion>
            </List.Section>

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationInTiming={width > 550 ? 700 : 300}
                animationOutTiming={width > 550 ? 700 : 300}
                backdropTransitionOutTiming={width > 550 ? 1000 : 500}
                backdropOpacity={0.55}
            >
                <DatePicker
                    mode='calendar'
                    onSelectedChange={date => setSelectedDate(date)}
                    selected={referenceDate.current}
                    current={referenceDate.current}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                    options={{
                        backgroundColor: Colors.subTheme,
                        textHeaderColor: 'white',
                        textDefaultColor: 'white',
                        textSecondaryColor: 'white',
                        selectedTextColor: 'white',
                        mainColor: accentColor,
                        borderColor: Colors.lightGrey
                    }}
                    style={{ borderRadius: 15 }}
                />
            </Modal>

            <Modal
                isVisible={modal2Visible}
                onBackButtonPress={() => setModal2Visible(false)}
                onBackdropPress={() => setModal2Visible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.55}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.headerLayout}>
                        <Text style={styles.headerText}>Choose the time of day</Text>
                        <TouchableOpacity onPress={() => setModal2Visible(false)}>
                            <AntDesign name='close' size={29} color='white'/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.border}/>
                    <Text style={{ color: 'white', alignSelf: 'center', marginTop: 15, fontSize: width > 550 ? 22 : 19 }}>{timeText}</Text>
                    <Slider
                        style={{ width: '85%', alignSelf: 'center', marginTop: 15 }}
                        minimumValue={0}
                        maximumValue={23}
                        step={1}
                        minimumTrackTintColor={accentColor}
                        maximumTrackTintColor='grey'
                        thumbTintColor='white'
                        value={hours}
                        onValueChange={value => {
                            clearTimeout(x);
                            let x = setTimeout(() => {
                                setHours(value);
                            }, 20)
                        }}
                    />
                    <Slider
                        style={{ width: '85%', alignSelf: 'center', marginTop: 25 }}
                        minimumValue={0}
                        maximumValue={59}
                        step={5}
                        minimumTrackTintColor={accentColor}
                        maximumTrackTintColor='grey'
                        thumbTintColor='white'
                        value={minutes}
                        onValueChange={value => {
                            clearTimeout(x);
                            let x = setTimeout(() => {
                                setMinutes(value);
                            }, 20)
                        }}
                    />
                </View>
            </Modal>

            <Modal
                isVisible={modal3Visible}
                onBackButtonPress={() => setModal3Visible(false)}
                onBackdropPress={() => setModal3Visible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.55}
            >
                <View style={styles.alertModalContainer}>
                    <Ionicons name='notifications-off-outline' size={37} color='white' style={{ alignSelf: 'center', marginTop: 15 }}/>
                    <View style={{ height: width > 550 ? 135 : 120, paddingHorizontal: 15, paddingTop: 15 }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 20 : 17, textAlign: 'center' }}>
                            Notifications disabled
                        </Text>
                        <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                            Please enable notifications for the app in your device's settings to receive reminders for your habit
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', flex: 1, borderTopWidth: width > 550 ? 1 : 0.5, borderColor: 'white' }}>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center' }}
                            onPress={() => setModal3Visible(false)}
                        >
                            <Text style={styles.modalButtonText}>Maybe Later</Text>
                        </TouchableOpacity>
                        <View style={{ width: width > 550 ? 1 : 0.5, height: 50, backgroundColor: 'white' }}/>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center' }}
                            onPress={() => {
                                setModal3Visible(false);
                                Linking.openSettings();
                            }}
                        >
                            <Text style={[styles.modalButtonText, { fontFamily: 'roboto-medium' }]}>Turn On</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    advancedOptionText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        fontFamily: 'roboto-medium'
    },
    startDateContainer: {
        backgroundColor: Colors.subTheme,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: width > 550 ? '80%' : '90%',
        height: width > 550 ? 70 : 60,
        alignSelf: 'center'
    },
    endDateContainer: {
        backgroundColor: Colors.subTheme,
        width: width > 550 ? '80%' : '90%',
        height: width > 550 ? 65 : 55,
        alignSelf: 'center'
    },
    endDateSelectionContainer: {
        backgroundColor: Colors.subTheme,
        width: width > 550 ? '80%' : '90%',
        height: width > 550 ? 55 : 50,
        alignSelf: 'center',
        justifyContent: 'flex-end',
        paddingBottom: width > 550 ? 15 : null
    },
    notificationsContainer: {
        backgroundColor: Colors.subTheme,
        width: width > 550 ? '80%' : '90%',
        height: width > 550 ? 65 : 60,
        alignSelf: 'center',
        top: width > 550 ? -1 : 0
    },
    notificationsSelectionContainer: {
        backgroundColor: Colors.subTheme,
        width: width > 550 ? '80%' : '90%',
        height: width > 550 ? 55 : 50,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingBottom: width > 550 ? 15 : null,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        top: width > 550 ? -1 : 0
    },
    iconLayout: {
        marginLeft: '2%',
        marginRight: '1.5%'
    },
    modalContainer: {
        backgroundColor: Colors.subTheme,
        borderRadius: 15,
        height: Platform.OS === 'ios' ? width > 550 ? 260 : 240
            : width > 550 ? 230 : 210,
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
        fontSize: width > 550 ? 22 : 20,
        fontFamily: 'roboto-medium'
    },
    border: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        width: '100%'
    },
    alertModalContainer: {
        backgroundColor: Colors.subTheme,
        borderRadius: 20,
        alignSelf: 'center',
        width: width > 550 ? '75%' : '85%',
        height: width > 550 ? 245 : 225
    },
    modalButtonText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        alignSelf: 'center'
    }
});

export default AdvancedOptions;