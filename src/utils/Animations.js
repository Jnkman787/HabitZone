import { Animated } from 'react-native';

const translateDown = (translation, value) => {
    Animated.timing(translation, {
        toValue: value ? value : 85,
        //toValue: value ? value : 35,
        useNativeDriver: true,
        duration: 300,
    }).start();
};

const translateUp = (translation) => {
    Animated.timing(translation, {
        toValue: 0,
        useNativeDriver: true,
        duration: 300
    }).start();
};

const fadeIn = (fade) => {
    Animated.timing(fade, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true
    }).start();
};

const fadeOut = (fade) => {
    Animated.timing(fade, {
        toValue: 0,
        duration: 200,
        //delay: 200,
        useNativeDriver: true
    }).start();
};

const sizeUp = (size, value) => {
    Animated.timing(size, {
        toValue: value ? value : 1,
        useNativeDriver: true,
        duration: 250,
    }).start();
};

const sizeDown = (size, value) => {
    Animated.timing(size, {
        toValue: value ? value : 0,
        useNativeDriver: true,
        duration: 250,
    }).start();
};

export { translateDown, translateUp, fadeIn, fadeOut, sizeUp, sizeDown }