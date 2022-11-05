import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { width } from '../../utils/Scaling';
import Colors from '../../utils/Colors';
import { useSelector, useDispatch } from 'react-redux';

import { setTutorial } from '../../store/settingsSlice';

const TutorialScreen = ({ navigation }) => {
    const tutorial = useSelector(state => state.settings.tutorial);
    const accentColor = useSelector(state => state.settings.accentColor);

    const [slideNumber, setSlideNumber] = useState(1);

    const dispatch = useDispatch();

    const getSlideImage = () => {
        let sourceImage = null;
        let sizeScale = 1;
        if (slideNumber === 1) {
            sourceImage = require('../../assets/images/Tutorial/slide_1.png');
            sizeScale = width > 550 ? 0.45 : 0.3;
        } else if (slideNumber === 2) {
            sourceImage = require('../../assets/images/Tutorial/slide_2.png');
            sizeScale = width > 550 ? 0.45 : 0.3;
        } else if (slideNumber === 3) {
            sourceImage = require('../../assets/images/Tutorial/slide_3.png');
            sizeScale = width > 550 ? 0.45 : 0.3;
        } else if (slideNumber === 4) {
            sourceImage = require('../../assets/images/Tutorial/slide_4.png');
            sizeScale = width > 550 ? 0.45 : 0.3;
        } else if (slideNumber === 5) {
            sourceImage = require('../../assets/images/Tutorial/slide_5.png');
            sizeScale = width > 550 ? 0.6 : 0.4;
        } else if (slideNumber === 6) {
            sourceImage = require('../../assets/images/Tutorial/slide_5.png');
            sizeScale = width > 550 ? 0.6 : 0.4;
        } else if (slideNumber === 7) {
            sourceImage = require('../../assets/images/Tutorial/slide_7.png');
            sizeScale = width > 550 ? 0.5 : 0.33;
        } else if (slideNumber === 8) {
            sourceImage = require('../../assets/images/Tutorial/slide_8.png');
            sizeScale = width > 550 ? 0.5 : 0.35;
        } else if (slideNumber === 9) {
            sourceImage = require('../../assets/images/Tutorial/slide_9.png');
            sizeScale = width > 550 ? 0.45 : 0.3;
        } else if (slideNumber === 10) {
            sourceImage = require('../../assets/images/Tutorial/slide_10.png');
            sizeScale = width > 550 ? 0.35 : 0.2;
        }

        return (
            <Image
                source={sourceImage}
                style={{ transform: [{ scale: sizeScale }], borderRadius: 40, borderWidth: 7, borderColor: Colors.lightTheme }}
            />
        );
    };

    const getSlideDescription = () => {
        let description = '';

        if (slideNumber === 1) {
            description = 'Click the plus sign to start creating a new habit';
        } else if (slideNumber === 2) {
            description = 'Habits will appear on the home screen on days when they are scheduled to be completed';
        } else if (slideNumber === 3) {
            description = 'After tapping the left circle, an expanded menu will be appear beneath any habits with a more specific target goal';
        } else if (slideNumber === 4) {
            description = 'Once completed, habits on the home screen will be marked with a green checkmark and shown in grey';
        } else if (slideNumber === 5) {
            description = 'Habits will also be displayed on a list screen, each providing you with a quick summary of your progress for the most recent seven days';
        } else if (slideNumber === 6) {
            description = 'Different colors are used to indicate your progress on reaching completion. Additionally, you can also tap them to mark a habit complete';
        } else if (slideNumber === 7) {
            description = 'Directly tapping a habit will bring up a screen with all of its details, starting with a calendar showing its entire history of completion';
        } else if (slideNumber === 8) {
            description = 'These details also include a variety of useful statistics';
        } else if (slideNumber === 9) {
            description = 'Would not be complete without more pretty colors';
        } else if (slideNumber === 10) {
            description = 'Thats only a taste of everything this app has to offer; now its up to you to go explore the rest';
        }

        return description;
    };

    return (
        <View style={styles.screen}>
            <TouchableOpacity
                style={{ alignItems: 'flex-end' }}
                onPress={() => {
                    if (tutorial === true) {
                        dispatch(setTutorial(false));
                        navigation.navigate('Tab', { screen: 'Home' })
                    } else {
                        navigation.navigate('SettingsStack', { screen: 'GeneralSettings' })
                    }
                }}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
                {getSlideImage()}
            </View>
            <View style={{ flex: 1, alignItems: 'center', paddingTop: 40 }}>
                <View style={{ width: width > 550 ? '75%' : '90%', height: 80 }}>
                    <Text style={styles.descriptionText}>{getSlideDescription()}</Text>
                </View>
                {slideNumber < 10
                    ? <TouchableOpacity
                        style={[styles.nextButtonContainer, { backgroundColor: accentColor }]}
                        onPress={() => {
                            let nextSlide = parseInt(slideNumber) + 1;
                            setSlideNumber(nextSlide);
                        }}
                    >
                        <Text style={styles.nextText}>NEXT</Text>
                    </TouchableOpacity>
                    : <TouchableOpacity
                        style={[styles.nextButtonContainer, { backgroundColor: accentColor, width: width > 550 ? 200 : 150 }]}
                        onPress={() => {
                            if (tutorial === true) {
                                dispatch(setTutorial(false));
                                navigation.navigate('Tab', { screen: 'Home' });
                            } else {
                                navigation.navigate('SettingsStack', { screen: 'GeneralSettings' });
                            }
                        }}
                    >
                        <Text style={styles.nextText}>GET STARTED</Text>
                    </TouchableOpacity>
                }
                <View style={{ flexDirection: 'row', height: 25, width: '90%', marginTop: 50, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={[styles.circle, { backgroundColor: slideNumber === 1 ? accentColor : Colors.lightTheme }]}/>
                    <View style={[styles.circle, { backgroundColor: slideNumber === 2 ? accentColor : Colors.lightTheme }]}/>
                    <View style={[styles.circle, { backgroundColor: slideNumber === 3 ? accentColor : Colors.lightTheme }]}/>
                    <View style={[styles.circle, { backgroundColor: slideNumber === 4 ? accentColor : Colors.lightTheme }]}/>
                    <View style={[styles.circle, { backgroundColor: slideNumber === 5 ? accentColor : Colors.lightTheme }]}/>
                    <View style={[styles.circle, { backgroundColor: slideNumber === 6 ? accentColor : Colors.lightTheme }]}/>
                    <View style={[styles.circle, { backgroundColor: slideNumber === 7 ? accentColor : Colors.lightTheme }]}/>
                    <View style={[styles.circle, { backgroundColor: slideNumber === 8 ? accentColor : Colors.lightTheme }]}/>
                    <View style={[styles.circle, { backgroundColor: slideNumber === 9 ? accentColor : Colors.lightTheme }]}/>
                    <View style={[styles.circle, { backgroundColor: slideNumber === 10 ? accentColor : Colors.lightTheme }]}/>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme,
        padding: width > 550 ? 40 : 30
    },
    skipText: {
        color: 'white',
        fontSize: width > 550 ? 19 : 16
    },
    imageContainer: {
        width: '100%',
        height: width > 550 ? '60%' : '45%',
        marginTop: width > 550 ? '5%' : '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    descriptionText: {
        color: 'white',
        fontSize: width > 550 ? 19 : 16,
        textAlign: 'center'
    },
    nextButtonContainer: {
        height: width > 550 ? 60 : 50,
        width: width > 550 ? 150 : 110,
        marginTop: 20,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    nextText: {
        color: 'white',
        fontSize: width > 550 ? 21 : 18,
        fontFamily: 'roboto-medium'
    },
    circle: {
        height: width > 550 ? 18 : 15,
        width: width > 550 ? 18 : 15,
        borderRadius: 13
    }
});

export default TutorialScreen;