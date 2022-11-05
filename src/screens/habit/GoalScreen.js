import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { width } from '../../utils/Scaling';
import Modal from 'react-native-modal';
import Colors from '../../utils/Colors';
import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import GoalOption from '../../components/GoalOption';
import { setGoal } from '../../store/setupSlice';

const GoalScreen = ({ navigation, route }) => {
    const { type } = route.params;
    const goal = useSelector(state => state.setup.goal);
    const accentColor = useSelector(state => state.settings.accentColor);

    const [goalType, setGoalType] = useState(goal.type);
    const [target, setTarget] = useState(goal.target);
    const [unit, setUnit] = useState(goal.unit);
    const [hours, setHours] = useState(goal.type === 'Duration' ? goal.hours : 0);
    const [minutes, setMinutes] = useState(goal.type === 'Duration' ? goal.minutes : 30);
    const [subtasks, setSubtasks] = useState(goal.subtasks ? goal.subtasks : []);
    const [modalVisible, setModalVisible] = useState(false);

    const dispatch = useDispatch();

    const checkAmount = () => {
        if (/^\d+$/.test(target)) {
            if (parseInt(target) > 0) {
                dispatch(setGoal({goalType, target, unit}));
                navigation.goBack();
            } else {
                Toast.show('Please enter a target value greater than zero', {
                    backgroundColor: Colors.darkGrey,
                    shadow: false,
                    textStyle: { fontSize: width > 550 ? 19 : 16 }
                });
            }
        } else {
            Toast.show('Please enter a number for the target value (no decimals)', {
                backgroundColor: Colors.darkGrey,
                shadow: false,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        }
    };

    const checkDurationScroll = () => {
        if (hours == 0 && minutes == 0) {
            Toast.show('Please enter a time duration of at least 1 minute', {
                duration : Toast.durations.SHORT,   // default
                position: Toast.positions.BOTTOM,   // default
                shadow: false,                      // default is true
                animation: true,                    // default
                hideOnPress: true,                  // default
                delay: 0,                           // default
                backgroundColor: Colors.darkGrey,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        } else {
            dispatch(setGoal({goalType, hours, minutes}));
            navigation.goBack();
        }
    };

    // check that they at least entered 1 subtask
    // if a subtask is left undefined or as an empty string, don't save it
    // if subtask 2 is empty but subtask 3 isn't, don't save subtask 2
    const checkChecklist = () => {
        if (subtasks[0]) {
            let newSubtasks = [];
            for (let i = 0; i < subtasks.length; i++) {
                if (subtasks[i]) {
                    let cleanStr = subtasks[i].trim();
                    if (cleanStr != '') {
                        newSubtasks = [...newSubtasks, subtasks[i]];
                    }
                }
            }
            dispatch(setGoal({goalType, newSubtasks}));
            navigation.goBack();
        } else {
            Toast.show('Please enter at least 1 subtask', {
                backgroundColor: Colors.darkGrey,
                shadow: false,
                textStyle: { fontSize: width > 550 ? 19 : 16 }
            });
        }
    };

    const setGoalParams = () => {
        if (goalType === 'Off') {
            dispatch(setGoal({goalType}));
            navigation.goBack();
        } else if (goalType === 'Amount') {
            checkAmount();
        } else if (goalType === 'Duration') {
            checkDurationScroll();
        } else if (goalType === 'Checklist') {
            checkChecklist();
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={[styles.headerRightContainer, { backgroundColor: accentColor }]}
                    onPress={() => {
                        if (type === 'Add') { setGoalParams(); }
                        else if (type === 'Edit') { setModalVisible(true); }
                    }}
                >
                    <Text style={styles.headerText}>SAVE</Text>
                </TouchableOpacity>
            ) 
        })
    }, [goalType, target, unit, hours, minutes, subtasks]);

    return (
        <View style={styles.screen}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ height: width > 550 ? goalType === 'Checklist' ? 760 : 560
                    : goalType === 'Checklist' ? 700 : 500
                }}
            >
                <GoalOption
                    option='Off' 
                    description='Simply record whether or not you have completed the activity'
                    goalType={goalType}
                    setGoalType={setGoalType}
                />
                <GoalOption 
                    option='Amount' 
                    description='Establish a daily goal with a unit value and allow yourself to record part completion'
                    goalType={goalType}
                    setGoalType={setGoalType}
                    goalValue1={target}
                    setGoalValue1={setTarget}
                    goalValue2={unit}
                    setGoalValue2={setUnit}
                />
                <GoalOption 
                    option='Duration' 
                    description='Establish a daily goal with time and record time spent peforming the activity'
                    goalType={goalType}
                    setGoalType={setGoalType}
                    goalValue1={hours}
                    setGoalValue1={setHours}
                    goalValue2={minutes}
                    setGoalValue2={setMinutes}
                />
                <GoalOption 
                    option='Checklist'
                    description='Track your activity using a list of subtasks'
                    goalType={goalType}
                    setGoalType={setGoalType}
                    goalValue1={subtasks}
                    setGoalValue1={setSubtasks}
                />
            </KeyboardAwareScrollView>

            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => setModalVisible(false)}
                onBackdropPress={() => setModalVisible(false)}
                animationInTiming={1}
                animationOutTiming={1}
                backdropOpacity={0.45}
            >
                <View style={styles.modalContainer}>
                    <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 15 }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 20 : 17, textAlign: 'center' }}>
                            Confirm this new goal?
                        </Text>
                        <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                            A new goal will be set, altering the tracking of statistics starting on today's date going forward
                        </Text>
                        <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                            Past recorded data will still be available but will be based on the previous set goal(s)
                        </Text>
                        <Text style={{ color: '#b3b3b3', fontSize: width > 550 ? 17 : 14, marginTop: 10, textAlign: 'center' }}>
                            This action can be undone by setting the goal back to its current value on the same day it was changed
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderColor: 'white' }}>
                        <TouchableOpacity
                            style={{ flex: 1, height: 50, justifyContent: 'center', borderTopWidth: width > 550 ? 1 : 0.75, borderTopColor: 'white' }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <View style={{ width: width > 550 ? 1 : 0.5, height: 50, backgroundColor: 'white' }}/>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', height: 50, backgroundColor: accentColor, borderBottomRightRadius: 20, 
                                borderTopColor: 'white', borderTopWidth: width > 550 ? 1 : 0.75, borderLeftWidth: 0.5, borderLeftColor: 'white'
                            }}
                            onPress={() => {
                                setGoalParams();
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

GoalScreen.navigationOptions = ({ route }) => {
    const { headerRight } = route.params;
    
    return {
        title: 'Daily goal',
        headerTitleAlign: 'center',
        headerRight
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme,
        paddingTop: 30
    },
    headerRightContainer: {
        right: 25,
        borderRadius: 12,
        top: 1
    },
    headerText: {
        color: 'white',
        fontSize: width > 550 ? 17 : 15,
        fontFamily: 'roboto-medium',
        marginVertical: 6,
        marginHorizontal: 10
    },
    modalContainer: {
        backgroundColor: Colors.subTheme,
        width: width > 550 ? '75%' : '95%',
        alignSelf: 'center',
        borderRadius: 20,
        height: 270
    },
    modalButtonText: {
        color: 'white',
        fontSize: width > 550 ? 20 : 17,
        alignSelf: 'center',
        fontFamily: 'roboto-medium'
    }
});

export default GoalScreen;