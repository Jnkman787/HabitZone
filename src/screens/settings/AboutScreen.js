import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { width } from '../../utils/Scaling';
import * as Linking from 'expo-linking';
import Colors from '../../utils/Colors';
import { useSelector } from 'react-redux';

const AboutScreen = () => {
    const accentColor = useSelector(state => state.settings.accentColor);

    return (
        <View style={styles.screen}>
            <ScrollView>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/images/HabitZone_logo.png')}
                        style={styles.logo}
                    />
                    <Text style={[styles.appNameText, { color: accentColor }]}>HabitZone</Text>
                    <Text style={{ color: 'white', fontSize: width > 550 ? 18 : 15, marginTop: 8 }}>Version 1.0.0</Text>
                </View>
                <View style={styles.linksContainer}>
                    <Text style={[styles.categoryText, { color: accentColor }]}>Links</Text>
                    {Platform.OS === 'android' 
                        ? <TouchableOpacity
                            style={styles.linkButton}
                            //onPress={() => }
                        >
                            <Text style={styles.regularText}>Share this app</Text>
                        </TouchableOpacity>
                        : null
                    }
                    {Platform.OS === 'ios' 
                        ? <TouchableOpacity
                            style={styles.linkButton}
                            //onPress={() => }
                        >
                            <Text style={styles.regularText}>Share this app</Text>
                        </TouchableOpacity>
                        : null
                    }
                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => Linking.openURL('https://habitzone.org/')}
                    >
                        <Text style={styles.regularText}>Visit this app's website</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.developerContainer}>
                    <Text style={[styles.categoryText, { color: accentColor, marginBottom: 20 }]}>Developer</Text>
                    <Text style={styles.regularText}>Joshua Matte</Text>
                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => Linking.openURL('https://www.linkedin.com/in/joshua-matte1/')}
                    >
                        <Text style={styles.regularText}>Visit LinkedIn profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    logoContainer: {
        height: width > 550 ? 260 : 220,
        alignItems: 'center',
        marginTop: 30,
        borderBottomWidth: 2,
        borderBottomColor: Colors.subTheme
    },
    logo: {
        width: width > 550 ? 150 : 125,
        height: width > 550 ? 150 : 125,
        borderRadius: 30
    },
    appNameText: {
        fontSize: width > 550 ? 23 : 20,
        fontFamily: 'roboto-medium',
        marginTop: 20
    },
    linksContainer: {
        paddingLeft: width > 550 ? 40 : 30,
        paddingTop: width > 550 ? 30 : 20,
        height: width > 550 ? 280 : 220,
        borderBottomWidth: 2,
        borderBottomColor: Colors.subTheme
    },
    linkButton: {
        backgroundColor: Colors.subTheme,
        height: width > 550 ? 70 : 55,
        width: width > 550 ? '93%' : '90%',
        marginTop: 20,
        justifyContent: 'center',
        paddingLeft: '5%',
        borderRadius: 15
    },
    categoryText: {
        fontSize: width > 550 ? 22 : 19,
        fontFamily: 'roboto-medium'
    },
    regularText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17
    },
    developerContainer: {
        paddingLeft: width > 550 ? 40 : 30,
        paddingTop: width > 550 ? 30 : 20
    }
});

export default AboutScreen;