import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Platform, DevSettings } from 'react-native';
import { width } from '../../utils/Scaling';
import Colors from '../../utils/Colors';
import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import StringInput from '../../components/StringInput';
import TransferOption from '../../components/TransferOption';
import AdvancedOptions from '../../components/AdvancedOptions';

import { addHabit } from '../../store/habitSlice';
import { setCategory, setGoal, setFrequency, setStartDate, setEndDate, setNotifications } from '../../store/setupSlice';

const AddHabitScreen = ({ navigation }) => {
    const scrollViewRef = useRef();
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');

    const accentColor = useSelector(state => state.settings.accentColor);

    const category = useSelector(state => state.setup.category);
    const color = useSelector(state => state.setup.color);
    const goal = useSelector(state => state.setup.goal);
    const frequency = useSelector(state => state.setup.frequency);
    const startDate = useSelector(state => state.setup.startDate);
    const endDate = useSelector(state => state.setup.endDate);
    const notifications = useSelector(state => state.setup.notifications);

    const dispatch = useDispatch();

    const formatDate = (date) => {
        let formattedDate;

        if (date.getMonth() < 9) {
            if (date.getDate() < 10) {
                formattedDate = date.getFullYear() + '/0' + (date.getMonth() + 1) + '/0' + date.getDate();
            } else {
                formattedDate = date.getFullYear() + '/0' + (date.getMonth() + 1) + '/' + date.getDate();
            }
        } else if (date.getDate() < 10) {
            formattedDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/0' + date.getDate();
        } else {
            formattedDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
        }

        return formattedDate;
    };

    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        // reset values
        dispatch(setCategory({category: '', color: ''}));
        dispatch(setGoal({goalType: 'Off'}));
        dispatch(setFrequency({frequencyType: 'Days_of_week', weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}));
        dispatch(setStartDate(formatDate(new Date())));
        dispatch(setEndDate(null));
        dispatch(setNotifications({enabled: false, time: null}));

        return () => {
            keyboardHideListener.remove();
            keyboardShowListener.remove();
        };
    }, []);

    const saveHabit = () => {
        const habitDetails = {
            habitName: name,
            habitCategory: category,
            categoryColor: color,
            habitGoal: goal,
            habitFrequency: frequency,
            habitNotes: notes,
            habitStartDate: startDate,
            habitEndDate: endDate,
            habitNotifications: notifications
        };

        dispatch(addHabit(habitDetails));

        setTimeout(function(){
            DevSettings.reload();
        }, 100);
    };

    const checkTextInput = () => {
        if (!name.trim()) {
            Toast.show('\n Please enter a habit name \n', {
                backgroundColor: Colors.darkGrey,
                position: Toast.positions.CENTER,
                opacity: 1,
                shadow: false,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        } else if (!category.trim()) {
            Toast.show('\n Please select a category \n', {
                backgroundColor: Colors.darkGrey,
                position: Toast.positions.CENTER,
                opacity: 1,
                shadow: false,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        } else if (!color.trim()) {
            Toast.show('\n Please select a color \n', {
                backgroundColor: Colors.darkGrey,
                position: Toast.positions.CENTER,
                opacity: 1,
                shadow: false,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        } else {
            saveHabit();
        }
    };

    return (
        <View style={styles.screen}>
            <KeyboardAwareScrollView ref={scrollViewRef}>
                <Text style={[styles.subHeaderText, { marginTop: 22 }]}>Name the habit</Text>
                <StringInput string={name} label='Name' setText={setName} length={20}/>

                <Text style={styles.subHeaderText}>Select a category</Text>
                <TransferOption navigation={navigation} option='Category' selectedValue={category}/>

                <Text style={styles.subHeaderText}>Daily goal</Text>
                <TransferOption navigation={navigation} option='Goal' selectedValue={goal} screenType='Add'/>

                <Text style={styles.subHeaderText}>How often</Text>
                <TransferOption navigation={navigation} option='Frequency' selectedValue={frequency} screenType='Add'/>

                <Text style={styles.subHeaderText}>Write some notes (optional)</Text>
                <StringInput 
                    string={notes}
                    label='Notes'
                    setText={setNotes}
                    paragraph={true}
                    scrollDown={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    length={150}
                />

                <AdvancedOptions scrollView={scrollViewRef} type='Add'/>
            </KeyboardAwareScrollView>
            <TouchableOpacity
                style={[styles.buttonContainer, { height: keyboardVisible ? 0 : 60, backgroundColor: accentColor }]}  // could also use opacity to hide save button faster on ios
                onPress={() => {
                    Keyboard.dismiss();
                    checkTextInput();
                }}
            >
                <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    subHeaderText: {
        color: Colors.lightGrey,
        fontSize: width > 550 ? 20 : 17,
        fontWeight: 'bold',
        marginLeft: width > 550 ? '10.5%' : '6%',
        marginTop: Platform.OS === 'ios' ? 32 : 27
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 10,
        width: width > 550 ? '80%' : '90%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    buttonText: {
        color: 'white',
        fontSize: width > 550 ? 22 : 20,
        fontFamily: 'roboto-medium'
    }
});

export default AddHabitScreen;