import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Image } from 'react-native';
import { width } from '../../utils/Scaling';
import * as Notifications from 'expo-notifications';
import Colors from '../../utils/Colors';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';

import NotificationItem from '../../components/NotificationItem';

import { Ionicons } from '@expo/vector-icons';

const NotificationsScreen = () => {
    const habits = useSelector((state) => state.habits.habits);

    const [modalVisible, setModalVisible] = useState(false);
    const [temp] = useState([]);

    const checkNotificationStatus = async () => {
        let check = await Notifications.getPermissionsAsync();
        if (check.status != 'granted') {
            setModalVisible(true);
        }
    };
    
    useEffect(() => {
        // check if notifications for the app are enabled in the settings of the user's phone
        // if not, display the alert inform them to turn the notifications on
        checkNotificationStatus();
    }, []);

    return (
        <View style={styles.screen}>
            <View style={{ height: 10 }}/>
            <FlatList
                data={habits}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 60 }}>
                        <Image
                            source={require('../../assets/images/empty_box.png')}
                            style={{ height: 80, width: 80, marginBottom: 20 }}
                        />
                        <Text style={{ color: 'white', fontSize: width > 550 ? 20 : 17 }}>No habits yet</Text>
                    </View>
                }
                renderItem={habitData => 
                    <NotificationItem  habit={habitData}/>
                }
            />

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.55}
            >
                <View style={styles.modalContainer}>
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
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Maybe Later</Text>
                        </TouchableOpacity>
                        <View style={{ width: width > 550 ? 1 : 0.5, height: 50, backgroundColor: 'white' }}/>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center' }}
                            onPress={() => {
                                setModalVisible(false);
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
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    modalContainer: {
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

export default NotificationsScreen;