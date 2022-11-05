import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Platform, TouchableOpacity } from 'react-native';
import { width, verticalScale } from '../utils/Scaling';
import Modal from 'react-native-modal';

const GetStarted = () => {
    const translation = useRef(new Animated.Value(0)).current;
    const fade = useRef(new Animated.Value(0)).current;
    const [modalVisible, setModalVisible] = useState(true);

    const verticalLoop = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translation, {
                    toValue: -15,
                    useNativeDriver: true,
                    duration: 1000,
                }),
                Animated.timing(translation, {
                    toValue: 0,
                    useNativeDriver: true,
                    duration: 1000
                })
            ])
        ).start();
    };

    const fadeLoop = () => {
        setTimeout(function() {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(fade, {
                        toValue: 1,
                        useNativeDriver: true,
                        duration: 1000
                    }),
                    Animated.timing(fade, {
                        toValue: 0,
                        useNativeDriver: true,
                        duration: 1000,
                    })
                ])
            ).start();
        }, 1000);
    };
    
    useEffect(() => {
        verticalLoop();
        fadeLoop();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', bottom: '10%' }}>
                <Image
                    source={require('../assets/images/bulb.png')}
                    style={{ width: width > 550 ? 175 : 150, height: width > 550 ? 175 : 150, marginBottom: 25 }}
                />
                <Text style={styles.text}>No Habits</Text>
                <Text style={styles.text}>Tap "+" to add your first habit.</Text>
            </View>

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                animationIn='fadeIn'
                animationOut='fadeOut'
                animationInTiming={1500}
                animationOutTiming={500}
                backdropOpacity={0.65}
            >
                <Text style={styles.title}>Get Started</Text>

                <Animated.View style={[styles.arrow, {
                    transform: [{ translateY: translation }]
                }]}>
                    <Image
                        source={require('../assets/images/down_arrow.png')}
                        style={{ width: width > 550 ? 90 : 75, height: width > 550 ? 100 : 80 }}
                    />
                </Animated.View>

                <Animated.View style={[styles.hexagon, {
                    opacity: fade
                }]}>
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                    >
                        <Image
                            source={require('../assets/images/white-hexagon-outline.png')}
                            style={{ width: 43, height: 40 }}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        color: 'white',
        fontFamily: 'sketch',
        fontSize: width > 550 ? 30 : 25,
        alignSelf: 'center',
        position: 'absolute',
        //bottom: '25%'
        bottom: width > 550 ? Platform.OS === 'ios' ? 220 : 190
            : Platform.OS === 'ios' ? 200 : 170
    },
    arrow: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 86 : 47,
        alignSelf: 'center'
    },
    hexagon: {
        position: 'absolute',
        bottom: width > 550 ? Platform.OS === 'ios' ? 23 : '-2.8%'
            : Platform.OS === 'ios' ? 23 : verticalScale(-11),
        alignSelf: 'center'
    },
    text: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17
    }
});

export default GetStarted;