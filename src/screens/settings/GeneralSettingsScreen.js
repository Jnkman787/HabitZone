import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { width } from '../../utils/Scaling';
import Modal from 'react-native-modal';
import Colors from '../../utils/Colors';
import { useDispatch } from 'react-redux';

import { clearHabits } from '../../store/habitSlice';
import { setTutorial, setStartingWeekday, setFinishedPosition, setSortType, setVacationMode, setAccentColor } from '../../store/settingsSlice';

import { AntDesign } from '@expo/vector-icons';

const GeneralSettingsScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const dispatch = useDispatch();

    return (
        <View style={styles.screen}>
            <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => navigation.navigate('SettingsStack', { screen: 'Tutorial' })}
            >
                <Text style={styles.optionText}>Tutorial</Text>
                <AntDesign name='right' size={21} color='white' style={{ top: 1 }}/>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => navigation.navigate('SettingsStack', { screen: 'PrivacyPolicy' })}
            >
                <Text style={styles.optionText}>Privacy Policy</Text>
                <AntDesign name='right' size={21} color='white' style={{ top: 1 }}/>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ color: '#cc0000', fontSize: width > 550 ? 22 : 19, bottom: 0.5, fontWeight: 'bold' }}>Delete all data</Text>
                <AntDesign name='right' size={21} color='white' style={{ top: 1 }}/>
            </TouchableOpacity>

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationInTiming={1}
                animationOutTiming={1}
                backdropOpacity={0.55}
            >
                <View style={[styles.modalContainer, { height: width > 550 ? 170 : 150 }]}>
                    <View style={{ height: 102, paddingHorizontal: 15, paddingTop: 15 }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 20 : 17, textAlign: 'center' }}>
                            Delete all data?
                        </Text>
                        <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                            Are you sure you want to reset the app and delete all data?
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', flex: 1, borderColor: 'white' }}>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center', borderTopWidth: width > 550 ? 1 : 0.75, borderTopColor: 'white' }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <View style={{ width: width > 550 ? 1 : 0.5, height: 50, backgroundColor: 'white' }}/>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', height: 50, backgroundColor: '#cc0000', borderBottomRightRadius: 20,
                                borderTopWidth: width > 550 ? 1 : 0.75, borderTopColor: 'white', borderLeftWidth: 0.5, borderLeftColor: 'white'
                            }}
                            onPress={() => {
                                setModalVisible(false);
                                // reset settings
                                dispatch(setTutorial(true));
                                dispatch(setStartingWeekday('Sun'));
                                dispatch(setFinishedPosition('Bottom'));
                                dispatch(setSortType('Oldest'));
                                dispatch(setVacationMode(false));
                                dispatch(setAccentColor('#cc5200'));
                                // clear all habits
                                dispatch(clearHabits());
                                // send user back to Home Screen
                                navigation.navigate('Tab', { screen: 'Home' });
                            }}
                        >
                            <Text style={styles.modalButtonText}>Reset</Text>
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
    optionContainer: {
        backgroundColor: Colors.subTheme,
        borderRadius: 15,
        alignSelf: 'center',
        height: width > 550 ? 90 : 80,
        width: width > 550 ? '80%' : '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width > 550 ? 20 : 15,
        marginTop: 15
    },
    optionText: {
        color: 'white',
        fontSize: width > 550 ? 22 : 19,
        fontFamily: 'roboto-medium',
        bottom: 0.5
    },
    modalContainer: {
        backgroundColor: Colors.subTheme,
        width: width > 550 ? '75%' : '85%',
        alignSelf: 'center',
        borderRadius: 20
    },
    modalButtonText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        alignSelf: 'center',
        fontFamily: 'roboto-medium'
    }
});

export default GeneralSettingsScreen;