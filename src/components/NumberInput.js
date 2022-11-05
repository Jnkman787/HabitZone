import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';
import { useSelector } from 'react-redux';

const NumberInput = ({ number, label, setNumber, style, style2, max, onExit }) => {
    const [activeInput, setActiveInput] = useState(false);

    const accentColor = useSelector(state => state.settings.accentColor);

    return (
        <View style={[styles.inputLayout, style]}>
            <TextInput
                onFocus={() => setActiveInput(true)}
                onBlur={() => { 
                    setActiveInput(false);
                    onExit;
                }}
                keyboardType='decimal-pad'
                placeholder={activeInput ? null : label ? label+' ' : null}
                placeholderTextColor={Colors.lightGrey}
                value={number}
                onChangeText={setNumber}
                maxLength={max}   // <-- change if needed
                style={[styles.inputContainer, style2, {
                    borderColor: activeInput ? accentColor : Colors.lightGrey,
                    borderWidth: activeInput ? 2 : 1
                }]}
            />
            <Text style={[styles.label, { color: Colors.lightGrey, opacity: number ? 1 : 0 }]}>{label ? '  ' + label + '  ' : null}</Text>
            <Text style={[styles.label, { color: accentColor, opacity: activeInput ? 1 : 0 }]}>{label ? '  ' + label + '  ' : null}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    inputLayout: {
        marginTop: 30
    },
    inputContainer: {
        alignSelf: 'center',
        textAlign: 'center',
        height: width > 550 ? 65 : 55,
        width: width > 550 ? '80%' : '90%',
        borderRadius: 5,
        color: 'white',
        fontSize: width > 550 ? 20 : 17
    },
    label: {
        position: 'absolute',
        alignSelf: 'center',
        top: width > 550 ? -13 : -8,
        backgroundColor: Colors.theme,
        fontSize: width > 550 ? 17 : 14
    }
});

export default NumberInput;