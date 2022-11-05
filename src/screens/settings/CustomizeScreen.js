import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { width } from '../../utils/Scaling';
import Colors from '../../utils/Colors';
import { useDispatch, useSelector } from 'react-redux';

import { setAccentColor } from '../../store/settingsSlice';

const CustomizeScreen = () => {
    const accentColor = useSelector(state => state.settings.accentColor);

    const dispatch = useDispatch();

    const ColorCircleOption = (color) => {
        return (
            <TouchableOpacity
                style={[styles.circleOutline, { borderColor: color,
                    borderWidth: color === accentColor ? 3 : 0
                }]}
                onPress={() => dispatch(setAccentColor(color))}
            >
                <View style={[styles.circle, { backgroundColor: color }]}/>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.screen}>
            <Text style={styles.titleText}>Accent Color</Text>
            <View style={{ flex: 1, paddingHorizontal: 0, paddingVertical: 30 }}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: width > 550 ? 'space-evenly' : 'space-between' }}>
                    {ColorCircleOption('#cc5200')}
                    {ColorCircleOption('#da2d2d')}
                    {ColorCircleOption('#2b67d5')}
                    {ColorCircleOption('#3c843a')}
                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: width > 550 ? 'space-evenly' : 'space-between', marginTop: 20 }}>
                    {ColorCircleOption('#ffa000')}
                    {ColorCircleOption('#de647e')}
                    {ColorCircleOption('#2995a3')}
                    {ColorCircleOption('#98bb2d')}
                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: width > 550 ? 'space-evenly' : 'space-between', marginTop: 20 }}>
                    {ColorCircleOption('#c2a756')}
                    {ColorCircleOption('#b3002d')}
                    {ColorCircleOption('#6152c7')}
                    {ColorCircleOption('#199a69')}
                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: width > 550 ? 'space-evenly' : 'space-between', marginTop: 20 }}>
                    {ColorCircleOption('#c79985')}
                    {ColorCircleOption('#f86a55')}
                    {ColorCircleOption('#ad42ba')}
                    {ColorCircleOption('#4f506f')}
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
    titleText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        fontFamily: 'roboto-medium',
        left: width > 550 ? '7%' : 0
    },
    circleOutline: {
        height: width > 550 ? 85 : 70,
        width: width > 550 ? 85 : 70,
        borderRadius: width > 550 ? 43 : 35,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    circle: {
        height: width > 550 ? 70 : 57,
        width: width > 550 ? 70 : 57,
        borderRadius: width > 550 ? 35 : 30
    }
});

export default CustomizeScreen;