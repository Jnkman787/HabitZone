import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { width } from '../utils/Scaling';
import Modal from 'react-native-modal';
import Colors from '../utils/Colors';
import { useSelector } from 'react-redux';

import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

const MenuScreen = ({ navigation }) => {
    const accentColor = useSelector(state => state.settings.accentColor);

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.screen}>
            <View style={{ flex: 1, justifyContent: 'space-evenly', marginVertical: 30 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <TouchableOpacity
                        style={styles.buttonLayout}
                        onPress={() => navigation.navigate('SettingsStack', { screen: 'HabitOptions' })}
                    >
                        <View style={[styles.habitCircle, { backgroundColor: accentColor }]}>
                            <Entypo name='check' size={width > 550 ? 45 : 38} color='white'/>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={styles.optionsText}>Habit Options</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonLayout}
                        onPress={() => navigation.navigate('SettingsStack', { screen: 'Notifications' })}
                    >
                        <View style={[styles.habitCircle, { backgroundColor: accentColor }]}>
                            <Ionicons name='notifications' size={width > 550 ? 44 : 38} color='white'/>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={styles.optionsText}>Notifications</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <TouchableOpacity
                        style={styles.buttonLayout}
                        onPress={() => setModalVisible(true)}
                    >
                        <View style={[styles.habitCircle, { backgroundColor: accentColor }]}>
                            <AntDesign name='star' size={width > 550 ? 44 : 35} color='white'/>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={styles.optionsText}>Rate</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonLayout}
                        onPress={() => navigation.navigate('SettingsStack', { screen: 'Customize' })}
                    >
                        <View style={[styles.habitCircle, { backgroundColor: accentColor }]}>
                            <MaterialCommunityIcons name='format-color-fill' size={width > 550 ? 51 : 45} color='white' style={{ top: width > 550 ? 7 : 6 }}/>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={styles.optionsText}>Customize</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <TouchableOpacity
                        style={styles.buttonLayout}
                        onPress={() => navigation.navigate('SettingsStack', { screen: 'About' })}
                    >
                        <View style={[styles.habitCircle, { backgroundColor: accentColor }]}>
                            <Foundation name='info' size={width > 550 ? 52 : 43} color='white'/>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={styles.optionsText}>About</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonLayout}
                        onPress={() => navigation.navigate('SettingsStack', { screen: 'GeneralSettings' })}
                    >
                        <View style={[styles.habitCircle, { backgroundColor: accentColor }]}>
                            <Ionicons name='settings-sharp' size={width > 550 ? 44 : 37} color='white'/>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Text style={styles.optionsText}>General Settings</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationOutTiming={300}
                backdropTransitionOutTiming={500}
                backdropOpacity={0.55}
            >
                <View style={styles.modalContainer}>
                    <AntDesign name='star' size={width > 550 ? 44 : 40} color='#ffa000' style={{ alignSelf: 'center', marginTop: 15 }}/>
                    <View style={{ height: width > 550 ? 135 : 95, paddingHorizontal: 15, paddingTop: 15 }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 20 : 17, textAlign: 'center' }}>
                            Do you like HabitZone?
                        </Text>
                        <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                            Please consider leaving a review
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', flex: 1, borderColor: 'white' }}>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center', borderTopWidth: width > 550 ? 1 : 0.75, borderTopColor: 'white' }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Maybe Later</Text>
                        </TouchableOpacity>
                        <View style={{ width: width > 550 ? 1 : 0.5, height: 50, backgroundColor: 'white' }}/>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center', backgroundColor: accentColor, borderBottomRightRadius: 20,
                                borderTopColor: 'white', borderTopWidth: width > 550 ? 1 : 0.75, borderLeftWidth: 0.5, borderLeftColor: 'white'
                            }}
                            onPress={() => {
                                setModalVisible(false);
                                // come back and finish coding this button
                            }}
                        >
                            <Text style={[styles.modalButtonText, { fontFamily: 'roboto-medium' }]}>Review now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

MenuScreen.navigationOptions = () => {
    return {
        title: null,
        headerLeft: () => (
            <Text style={styles.headerLeftStyle}>Menu</Text>
        ),
        tabBarIcon: ({ focused }) => (
            <AntDesign name={focused ? 'appstore1' : 'appstore-o'} size={27} color='white' style={{ right: 3 }}/>
        )
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    headerLeftStyle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'roboto-medium',
        left: 25,
        top: 2
    },
    buttonLayout: {
        backgroundColor: Colors.subTheme,
        width: width > 550 ? 180 : 140,
        height: width > 550 ? 180 : 140,
        borderRadius: 20
    },
    optionsText: {
        color: 'white',
        fontSize: width > 550 ? 18 : 15,
        fontFamily: 'roboto-medium',
        alignSelf: 'center',
        marginBottom: 20
    },
    habitCircle: {
        width: width > 550 ? 75 : 60,
        height: width > 550 ? 75 : 60,
        borderRadius: width > 550 ? 25 : 20,
        alignSelf: 'center',
        marginTop: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        backgroundColor: Colors.subTheme,
        borderRadius: 20,
        alignSelf: 'center',
        width: width > 550 ? '75%' : '85%',
        height: width > 550 ? 220 : 200
    },
    modalButtonText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        alignSelf: 'center'
    }
});

export default MenuScreen;