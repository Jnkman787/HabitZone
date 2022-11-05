import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';
import { useSelector } from 'react-redux';

const StringInput = ({ string, label, setText, setEndText, scrollDown, style, paragraph, length }) => {
    const [activeInput, setActiveInput] = useState(false);

    const accentColor = useSelector(state => state.settings.accentColor);

    return (
        <View style={[styles.inputLayout, style]}>
            <TextInput
                onFocus={() => setActiveInput(true)}
                onBlur={() => {
                    setActiveInput(false);
                    if (label === 'Notes') {
                        scrollDown();
                    }
                }}
                placeholder={activeInput ? '' : label}
                placeholderTextColor={Colors.lightGrey}
                value={string}
                onChangeText={setText}
                onEndEditing={setEndText}
                multiline={paragraph}
                maxLength={length}
                style={[styles.inputContainer, {
                    borderColor: activeInput ? accentColor : Colors.lightGrey,
                    borderWidth: activeInput ? 2 : 1,
                    height: width > 550 ? label === 'Notes' ? 90 : 65
                        : label === 'Notes' ? 80 : 55
                }]}
            />
            <Text style={[styles.label, { color: Colors.lightGrey, opacity: string ? 1 : 0 }]}>{'  ' + label + '  '}</Text>
            <Text style={[styles.label, { color: accentColor, opacity: activeInput ? 1 : 0 }]}>{'  ' + label + '  '}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    inputLayout: {
        marginTop: 16
    },
    inputContainer: {
        alignSelf: 'center',
        width: width > 550 ? '80%' : '90%',
        paddingHorizontal: width > 550 ? 20 : 15,
        borderRadius: 5,
        color: 'white',
        fontSize: width > 550 ? 20 : 17
    },
    label: {
        position: 'absolute',
        left: width > 550 ? '13.5%' : '10%',
        top: width > 550 ? -13 : -8,
        backgroundColor: Colors.theme,
        fontSize: width > 550 ? 17 : 14
    }
});

export default StringInput;