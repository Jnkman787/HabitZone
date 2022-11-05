import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';

import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

const OpeningScreen = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <View style={{ padding: width > 550 ? 40 : 30 }}>
                <Text style={styles.titleText}>Welcome to</Text>
                <Text style={styles.nameText}>HabitZone</Text>
            </View>

            <Text style={styles.sloganText}>Organize your life with our assistance</Text>

            <View style={{ marginTop: width > 550 ? '10%' : '15%', flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name='checkmark-circle' size={width > 550 ? 35 : 30} color='#cc5200' style={{ marginRight: 10, marginLeft: width > 550 ? '5%' : 10 }}/>
                <Text style={styles.listText}>Plan your daily schedule with a habit list</Text>
            </View>

            <View style={{ marginTop: width > 550 ? '5%' : '7%', flexDirection: 'row', alignItems: 'center' }}>
                <Foundation name='graph-pie' size={width > 550 ? 40 : 35} color='#cc5200' style={{ marginRight: 10, marginLeft: width > 550 ? '5.5%' : 12 }}/>
                { width > 550 
                    ? <Text style={styles.listText}>Track your streak along with a variety of other statistics</Text>
                    : <Text style={styles.listText}>Track your streak along with a variety of       other statistics</Text>
                }
            </View>

            <View style={{ marginTop: width > 550 ? '5%' : '7%', flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name='notifications' size={width > 550 ? 35 : 30} color='#cc5200' style={{ marginRight: 10, marginLeft: width > 550 ? '5%' : 10 }}/>
                <Text style={styles.listText}>Make your life more regulated by setting reminders</Text>
            </View>

            <View style={{ marginTop: width > 550 ? '5%' : '7%', flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name='trophy' size={width > 550 ? 35 : 30} color='#cc5200' style={{ marginRight: 10, marginLeft: width > 550 ? '5%' : 10 }}/>
                { width > 550 
                    ? <Text style={styles.listText}>Achieve more ambitious goals to enhance your life</Text>
                    : <Text style={styles.listText}>Achieve more ambitious goals to enhance         your life</Text>
                }
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '10%' }}>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => navigation.navigate('SettingsStack', { screen: 'Tutorial' })}
                >
                    <Text style={styles.buttonText}>GET STARTED</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    titleText: {
        color: 'white',
        fontSize: width > 550 ? 40 : 30,
        fontWeight: 'bold',
        marginTop: width > 550 ? '20%' : '25%'
    },
    nameText: {
        color: 'white',
        fontSize: width > 550 ? 65 : 50,
        fontFamily: 'westmeath',
        left: width > 550 ? 40 : 35
    },
    sloganText: {
        color: '#b3b3b3',
        fontSize: width > 550 ? 21 : 17,
        marginTop: width > 550 ? '4%' : '6%',
        textAlign: 'center'
    },
    listText: {
        color: 'white',
        fontSize: width > 550 ? 21 : 16,
        fontWeight: 'bold'
    },
    buttonContainer: {
        backgroundColor: '#cc5200',
        height: width > 550 ? 70 : 60,
        width: width > 550 ? 250 : 200,
        marginTop: 20,
        borderRadius: width > 550 ? 35 : 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: width > 550 ? 23 : 20,
        fontWeight: 'bold'
    }
});

export default OpeningScreen;