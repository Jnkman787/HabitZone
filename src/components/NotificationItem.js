import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { width, verticalScale, scale } from '../utils/Scaling';
import Colors from '../utils/Colors';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';

import { updateNotification } from '../store/habitSlice';

import { AntDesign } from '@expo/vector-icons';

const NotificationItem = ({ habit }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(habit.item.notifications.enabled);
    const [hours, setHours] = useState(9);
    const [minutes, setMinutes] = useState(0);
    const [timeText, setTimeText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const accentColor = useSelector(state => state.settings.accentColor);

    const dispatch = useDispatch();

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

    useEffect(() => {
        if (habit.item.notifications.enabled === true) {
            let timeHours = habit.item.notifications.time.substring(0, 2); 
            let timeMinutes = habit.item.notifications.time.substring(3, 5);
            
            // set hours 
            if (timeHours.substring(0, 1) === '0') { setHours(parseInt(timeHours.substring(1))); }
            else { setHours(parseInt(timeHours)); }

            // set minutes
            if (timeMinutes.substring(0, 1) === '0') { setMinutes(parseInt(timeMinutes.substring(1))); }
            else { setMinutes(parseInt(timeMinutes)); }
        }
    }, []);

    useEffect(() => {
        if (notificationsEnabled === true) {
            // setup/update notifications value and time text
            let newNotification = {
                enabled: true,
                time: getTimeText()
            };
            dispatch(updateNotification({habitId: habit.item.id, notification: newNotification}));
            setTimeText(getTimeText());
        } else if (notificationsEnabled === false) {
            // reset notifications value and time text
            let newNotification = {
                enabled: false,
                time: null
            };
            dispatch(updateNotification({habitId: habit.item.id, notification: newNotification}));
            setTimeText('');
            setHours(9);
            setMinutes(0);
        }
    }, [notificationsEnabled, hours, minutes]);

    return (
        <View style={[styles.notificationContainer, {
            height: notificationsEnabled ? width > 550 ? 140 : 120 : width > 550 ? 90 : 70
        }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 50, alignItems: 'center' }}>
                <Text style={styles.habitNameText}>{habit.item.name}</Text>
                <Switch
                    value={notificationsEnabled}
                    trackColor={{ false: 'grey', true: accentColor}}
                    thumbColor={'white'}
                    onValueChange={() => {
                        setNotificationsEnabled(previousState => !previousState);
                    }}
                    style={{ transform: width > 550 ? [{ scaleX: 1.3 }, { scaleY: 1.3 }] : [] }}
                />
            </View>
            {notificationsEnabled
                ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ height: width > 550 ? 45 : 40, 
                            width: width > 550 ? 150 : 110,
                            justifyContent: 'center', 
                            alignItems: 'center',
                            backgroundColor: Colors.theme,
                            borderRadius: 5
                        }}
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: width > 550 ? 20 : 17, marginHorizontal: 10 }}>{timeText}</Text>
                    </TouchableOpacity>
                </View>
                : null
            }

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.55}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.headerLayout}>
                        <Text style={styles.headerText}>Choose the time of day</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    notificationContainer: {
        width: width > 550 ? '80%' : '90%',
        backgroundColor: Colors.subTheme,
        borderRadius: 20,
        alignSelf: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
        paddingTop: width > 550 ? 20 : 10,
        paddingBottom: width > 550 ? 20 : 15
    },
    habitNameText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        fontFamily: 'roboto-medium',
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
    }
});

export default NotificationItem;