import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';

const startRotationAnimation = (durationMs, rotationDegree) => {
    Animated.loop(Animated.timing(
        rotationDegree,
        {
            toValue: 360,
            duration: durationMs,
            easing: Easing.linear,
            useNativeDriver: false
        }
    )).start();
}

const LoadingSpinner = ({ color }) => {
    let durationMs = 1000;
    const rotationDegree = useRef(new Animated.Value(0)).current

    useEffect(() => {
        startRotationAnimation(durationMs, rotationDegree);
    }, [durationMs, rotationDegree]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theme}}>
            <View style={styles.container} accessibilityRole='progressbar'>
                <View style={[styles.background, { borderColor: color }]}/>
                <Animated.View
                    style={[styles.progress, { borderTopColor: color }, {
                        transform: [{
                            rotateZ: rotationDegree.interpolate({
                                inputRange: [0, 360],
                                outputRange: ['0deg', '360deg']
                            })
                        }]
                    }]}
                />
            </View>
        </View>
    );
};

const height = width > 550 ? 150 : 100;

const styles = StyleSheet.create({
  container: {
    width: height,
    height: height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  background: {
    width: '100%',
    height: '100%',
    borderRadius: height / 2,
    borderWidth: width > 550 ? 15 : 12,
    opacity: 0.25
  },
  progress: {
    width: '100%',
    height: '100%',
    borderRadius: height / 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: width > 550 ? 15 : 12,
    position: 'absolute'
  }
});

export default LoadingSpinner