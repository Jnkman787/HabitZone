import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { width } from '../utils/Scaling';
import { useSelector } from 'react-redux';

import CustomIcon from '../utils/CustomIcon';
import { Ionicons } from '@expo/vector-icons';

const AddButton = ({ navigation }) => {
    const accentColor = useSelector(state => state.settings.accentColor);

    return (
        <TouchableOpacity
            style={styles.buttonLayout}
            onPress={() => navigation.navigate('HabitStack', { screen: 'AddHabit' })}
        >
            <CustomIcon name='hexagon' size={39} color={accentColor} style={{ top: 7 }}/>
            <View style={styles.plusSign}>
                <Ionicons name='add' size={30} color='white'/>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonLayout: {
        alignItems: 'center',
        top: 1
    },
    plusSign: {
        zIndex: 1,
        bottom: width > 550 ? 29 : 28,
        left: 1
    }
});

export default AddButton;