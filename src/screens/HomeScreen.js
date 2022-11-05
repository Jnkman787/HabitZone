import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';
import { useSelector } from 'react-redux';

import HorizontalCalendar from '../components/HorizontalCalendar';
import HomeHabitList from '../components/HomeHabitList';
import GetStarted from '../components/GetStarted';

import CustomIcon from '../utils/CustomIcon';
import { Entypo } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const [selectedDay, setSelectedDay] = useState({    // start with today's date
        weekday: new Date().toDateString().slice(0, 3),
        day: new Date().getDate(),
        month: new Date().toDateString().slice(4, 7),
        monthNumber: new Date().getMonth(),
        year: new Date().getFullYear()
    });

    const habits = useSelector((state) => state.habits.habits);    // array of objects
    const tutorial = useSelector(state => state.settings.tutorial);
    const accentColor = useSelector(state => state.settings.accentColor);
    const [timePeriod, setTimePeriod] = useState('Present');
    const resetDay = useRef(null);

    useEffect(() => {
        if (tutorial === true) {
            navigation.navigate('Opening');
        }
    }, [tutorial]);

    const setFullWeekdayName = () => {
        if (selectedDay.weekday === 'Sun') { return 'Sunday'; }
        else if (selectedDay.weekday === 'Mon') { return 'Monday'; }
        else if (selectedDay.weekday === 'Tue') { return 'Tuesday'; }
        else if (selectedDay.weekday === 'Wed') { return 'Wednesday'; }
        else if (selectedDay.weekday === 'Thu') { return 'Thursday'; }
        else if (selectedDay.weekday === 'Fri') { return 'Friday'; }
        else if (selectedDay.weekday === 'Sat') { return 'Saturday'; }
    };

    const getStringDate = (days) => {
        let day = new Date();
        day.setDate(day.getDate() + days);

        let stringDay;
        if (parseInt(day.getMonth()) < 10) {
            if (parseInt(day.getDate()) < 10) {
                stringDay = day.getFullYear() + '-0' + day.getMonth() + '-0' + day.getDate();
            } else {
                stringDay = day.getFullYear() + '-0' + day.getMonth() + '-' + day.getDate();
            }
        } else if (parseInt(day.getDate()) < 10) {
            stringDay = day.getFullYear() + '-' + day.getMonth() + '-0' + day.getDate();
        } else {
            stringDay = day.getFullYear() + '-' + day.getMonth() + '-' + day.getDate();
        }
        return stringDay;
    };

    useEffect(() => {
        let chosenDay;
        if (selectedDay.monthNumber < 10) {
            if (selectedDay.day < 10) {
                chosenDay = selectedDay.year + '-0' + selectedDay.monthNumber + '-0' + selectedDay.day;
            } else {
                chosenDay = selectedDay.year + '-0' + selectedDay.monthNumber + '-' + selectedDay.day;
            }
        } else if (selectedDay.day < 10) {
            chosenDay = selectedDay.year + '-' + selectedDay.monthNumber + '-0' + selectedDay.day;
        } else {
            chosenDay = selectedDay.year + '-' + selectedDay.monthNumber + '-' + selectedDay.day;
        }
        
        // setup dates for easy comparison
        let today = getStringDate(0);
        let tomorrow = getStringDate(1);
        let yesterday = getStringDate(-1);

        let dateTitle;
        let dateTitle2 = setFullWeekdayName();

        // check what title to display for the date
        if (chosenDay === today) {
            dateTitle = 'Today';
            dateTitle2 = selectedDay.month + '. ' + selectedDay.day;
            setTimePeriod('Present');
        } else if (chosenDay === yesterday) {
            dateTitle = 'Yesterday';
            setTimePeriod('Past');
        } else if (chosenDay === tomorrow) {
            dateTitle = 'Tomorrow';
            setTimePeriod('Future');
        } else if (selectedDay.year == today.slice(0, 4)) {
            dateTitle = selectedDay.month + '. ' + selectedDay.day;

            if (parseInt(selectedDay.monthNumber) < parseInt(today.slice(5, 7))) { setTimePeriod('Past'); } 
            else if (parseInt(selectedDay.monthNumber) > parseInt(today.slice(5, 7))) { setTimePeriod('Future'); } 
            else {
                if (parseInt(selectedDay.day) < parseInt(today.slice(8, 10))) { setTimePeriod('Past'); }
                else if (parseInt(selectedDay.day) > parseInt(today.slice(8, 10))) { setTimePeriod('Future'); }
            }
        } else {
            dateTitle = selectedDay.month + '. ' + selectedDay.day + ', ' + selectedDay.year;

            if (parseInt(selectedDay.year) < parseInt(today.slice(0, 4))) { setTimePeriod('Past'); }
            else if (parseInt(selectedDay.year) > parseInt(today.slice(0, 4))) { setTimePeriod('Future'); }
        }

        navigation.setOptions({
            headerLeft: () => {
                if (width > 550) {
                    return (
                        <View style={{ flexDirection: 'row', alignItems: 'center', left: 25, bottom: Platform.OS === 'ios' ? 4 : 0 }}>
                            <Text style={styles.headerLeftStyle}>{dateTitle}</Text>
                            <Text style={styles.subHeaderLeftStyle}>{dateTitle2}</Text>
                        </View>
                    );
                } else {
                    return (
                        <View style={{ justifyContent: 'center', left: 25, bottom: Platform.OS === 'ios' ? 4 : 0 }}>
                            <Text style={styles.headerLeftStyle}>{dateTitle}</Text>
                            <Text style={styles.subHeaderLeftStyle}>{dateTitle2}</Text>
                        </View>
                    );
                }
            }
        });
    }, [selectedDay]);

    return (
        <View style={styles.screen}>
            <HorizontalCalendar
                selectedWeekday={selectedDay}
                setSelectedWeekday={setSelectedDay}
                resetDay={resetDay}
            />

            <View style={{ borderBottomColor: Colors.subTheme, borderBottomWidth: 1, marginTop: 5, marginBottom: 3 }}/>

            {tutorial === true ? null : habits.length === 0 ? <GetStarted/> : <HomeHabitList
                navigation={navigation} selectedDay={selectedDay}
            />}

            {timePeriod === 'Present' ? null : <TouchableOpacity
                style={[styles.todayButtonContainer, { right: timePeriod === 'Past' ? 0 : null,
                    borderTopLeftRadius: timePeriod === 'Past' ? 25 : 0,
                    borderBottomLeftRadius: timePeriod === 'Past' ? 25 : 0,
                    borderTopRightRadius: timePeriod === 'Future' ? 25 : 0,
                    borderBottomRightRadius: timePeriod === 'Future' ? 25 : 0,
                    backgroundColor: accentColor
                }]}
                onPress={() => resetDay.current()}
            >
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {timePeriod === 'Future' ? <Entypo name='chevron-left' size={35} color='white' style={{ left: width > 550 ? 0 : 3 }}/> : null}
                    <Text style={{ color: 'white', fontSize: width > 550 ? 22 : 19, fontWeight: 'bold', marginRight: timePeriod === 'Past' ? -15 : 15 }}>Today</Text>
                    {timePeriod === 'Past' ? <Entypo name='chevron-right' size={35} color='white' style={{ left: width > 550 ? 14 : 10 }}/> : null}
                </View>
            </TouchableOpacity>}
        </View>
    );
};

HomeScreen.navigationOptions = ({ route }) => {
    const { headerLeft } = route.params;

    return {
        title: null,
        headerRight: () => (
            <Text style={styles.headerRightStyle}>HabitZone</Text>
        ),
        headerLeft,
        tabBarIcon: ({ focused }) => {
            if (focused) {
                return (<Entypo name='home' size={30} color='white' style={{ left: 3 }}/>);
            } else {
                return (<CustomIcon name='home-outline' size={26} color='white' style={{ left: 3 }}/>);
            }
        }
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.theme
    },
    headerRightStyle: {
        fontFamily: 'westmeath',
        color: 'white',
        fontSize: 26,
        right: 25,
        justifyContent: 'center',
        bottom: Platform.OS === 'ios' ? 5 : 0
    },
    headerLeftStyle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: width > 550 ? 24 : 21
    },
    subHeaderLeftStyle: {
        color: '#b3b3b3',
        fontSize: width > 550 ? 19 : 15,
        marginLeft: width > 550 ? 10 : 0,
        top: width > 550 ? 1 : 0
    },
    todayButtonContainer: {
        height: width > 550 ? 60 : 50,
        width: width > 550 ? 120 : 100,
        position: 'absolute',
        bottom: '7%'
    }
});

export default HomeScreen;