import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';

// icons
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomIcon from '../utils/CustomIcon';

const getCategoryIcon = (category) => {
    let icon;

    if (category === 'Quit') {
        icon = <MaterialIcons name='do-not-disturb' size={32} color='white'/>
    } else if (category === 'Sports') {
        icon = <Ionicons name='basketball' size={32} color='white'/>
    } else if (category === 'Study') {
        icon = <Ionicons name='school' size={29} color='white'/>
    } else if (category === 'Work') {
        icon = <MaterialIcons name='work' size={28} color='white'/>
    } else if (category === 'Nutrition') {
        icon = <Ionicons name='nutrition' size={29} color='white'/>
    } else if (category === 'Home') {
        icon = <Ionicons name='home' size={27} color='white'/>
    } else if (category === 'Outdoor') {
        icon = <Entypo name='tree' size={27} color='white' />
    } else if (category === 'Social') {
        icon = <MaterialCommunityIcons name='message-text' size={27} color='white'/>
    } else if (category === 'Art') {
        icon = <Ionicons name='color-palette' size={30} color='white'/>
    } else if (category === 'Finance') {
        icon = <CustomIcon name='coin2' size={28} color='white'/>
    } else if (category === 'Other') {
        icon = <MaterialCommunityIcons name='dots-horizontal-circle' size={32} color='white'/>
    } else if (category === 'Travel') {
        icon = <Ionicons name='airplane' size={29} color='white'/>
    } else if (category === 'Health') {
        icon = <MaterialCommunityIcons name='gamepad-round' size={32} color='white'/>
    } else if (category === 'Leisure') {
        icon = <Ionicons name='happy' size={31} color='white'/>
    } else if (category === 'Pets') {
        icon = <Ionicons name='paw' size={29} color='white'/>
    }

    return icon;
};

const CalendarHabitItem = ({ navigation, habit, selectedDay }) => {
    const [currentGoal, setCurrentGoal] = useState(habit.item.goal);

    useEffect(() => {
        checkGoalChanges();
    }, [selectedDay]);

    const checkGoalChanges = () => {
        if (habit.item.changes.goals.length > 0) {
            // find the goal change closest to the selected day that takes place after
            let goalIndex;
            let date = new Date(selectedDay);
            for (let i = 0; i < habit.item.changes.goals.length; i++) {
                let changeDate = new Date(habit.item.changes.goals[i].date);
                if (date.getFullYear() === changeDate.getFullYear()) {
                    if (date.getMonth() === changeDate.getMonth()) {
                        if (date.getDate() < changeDate.getDate()) { 
                            goalIndex = i;
                            break;
                        }
                    } else if (date.getMonth() < changeDate.getMonth()) {
                        goalIndex = i;
                        break;
                    }
                } else if (date.getFullYear() < changeDate.getFullYear()) {
                    goalIndex = i;
                    break;
                }
            }

            if (goalIndex >= 0) {
                setCurrentGoal(habit.item.changes.goals[goalIndex].change);
            } else {
                setCurrentGoal(habit.item.goal);
            }
        }
    };

    const getGoal = (goal) => {
        let displayGoal;

        if (goal.type === 'Amount') {
            if (goal.unit != undefined) {
                displayGoal = goal.target + ' ' + goal.unit;
            } else { displayGoal = goal.target; }
        } else if (goal.type === 'Duration') {
            if (goal.hours > 0) {
                if (goal.minutes > 0) {
                    displayGoal = goal.hours + 'h ' + goal.minutes + 'min';
                } else { displayGoal = goal.hours + 'h'; }
            } else if (goal.minutes > 0) {
                displayGoal = goal.minutes + 'min';
            }
        } else if (goal.type === 'Checklist') {
            if (goal.subtasks.length > 1) {
                displayGoal = goal.subtasks.length + ' subtasks';
            } else {
                displayGoal = goal.subtasks.length + ' subtask';
            }
        }

        return displayGoal;
    };

    const TitleLayout = () => {
        let goal = getGoal(currentGoal);

        if (goal != null) {
            return (
                <View>
                    <Text style={styles.nameText}>{habit.item.name}</Text>
                    <View style={{ height: 4 }}/>
                    <Text style={styles.descriptionText}>{goal}</Text>
                </View>
            );
        } else {
            return (
                <Text style={styles.nameText}>{habit.item.name}</Text>
            );
        }
    };

    const SideBar = () => {
        return (
            <View style={{ marginRight: 15 }}>
                <View style={{ flex: 1, width: 1, backgroundColor: 'white', marginLeft: width > 550 ? 22 : 19 }}/>
                <View style={styles.outerCircle}>
                    <View style={[styles.iconCircle, { backgroundColor: habit.item.color }]}>
                        {getCategoryIcon(habit.item.category)}
                    </View>
                </View>
                <View style={{ height: width > 550 ? 22 : 18, width: 1, backgroundColor: 'white', marginLeft: width > 550 ? 22 : 19 }}/>
            </View>
        );
    };

    return (
        <TouchableHighlight
            style={{ width: width > 550 ? '75%' : '90%', alignSelf: 'center' }}
            onPress={() => navigation.navigate('DetailsStack', { screen: 'HabitDetails', params: { selectedHabit: habit.item } })}
            underlayColor={Colors.theme}
        >
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {SideBar()}
                <View style={{ marginTop: 18, height: width > 550 ? 95 : 80, flex: 1, backgroundColor: Colors.subTheme, borderRadius: 20, justifyContent: 'center' }}>
                    {TitleLayout()}
                </View>
                <View style={[styles.colorBar, { backgroundColor: habit.item.color }]}/>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    nameText: {
        color: 'white',
        fontSize: width > 550 ? 21 : 18,
        fontFamily: 'roboto-medium',
        marginLeft: 25
    },
    descriptionText: {
        color: 'white',
        fontSize: width > 550 ? 17 : 15,
        marginLeft: 25
    },
    outerCircle: {
        height: width > 550 ? 51 : 46,
        width: width > 550 ? 51 : 46,
        borderRadius: width > 550 ? 26 : 23,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.theme,
        right: 3
    },
    iconCircle: {
        height: width > 550 ? 45 : 40,
        width: width > 550 ? 45 : 40,
        borderRadius: width > 550 ? 23 : 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    colorBar: {
        height: width > 550 ? 50 : 40,
        width: width > 550 ? 8 : 7,
        borderRadius: 5,
        right: width > 550 ? 25 : 20,
        top: width > 550 ? 38 : 38
    }
});

export default CalendarHabitItem;