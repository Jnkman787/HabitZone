import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { getMonthName } from '../utils/Weekdays';
import { getStreak, getTotal, getBarGraphTotals, getPieChartTotals } from '../utils/Statistics';
import { width } from '../utils/Scaling';
import Colors from '../utils/Colors';
import { PieChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';

import { AntDesign } from '@expo/vector-icons';

const StatisticsDetails = ({ habit }) => {
    const [referenceDate, setReferenceDate] = useState(new Date());
    const [monthCompletions, setMonthCompletions] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [pieChartTotals, setPieChartTotals] = useState([0, 0, 0]);

    const startingWeekday = useSelector(state => state.settings.startingWeekday);
    const accentColor = useSelector(state => state.settings.accentColor);

    //useEffect(() => {
        //console.log(habit);
    //}, []);

    useEffect(() => {
        // update the number of completions for each month of the bar graph
        setMonthCompletions(getBarGraphTotals(habit, referenceDate.getFullYear()));
    }, [habit, referenceDate]);

    useEffect(() => {
        // update the pie chart totals for completions, partials, and misses
        setPieChartTotals(getPieChartTotals(habit, startingWeekday));
    }, [habit]);

    // update referenceDate to first day of previous year
    const onTapLeft = () => {
        setReferenceDate(new Date(String((referenceDate.getFullYear() - 1)) + '/01/01'));
    };

    // update referenceDate to first day of next year
    const onTapRight = () => {
        setReferenceDate(new Date(String((referenceDate.getFullYear() + 1)) + '/01/01'));
    };

    const UnitTitle = () => {
        let units;
        if (habit.goal.type === 'Amount') {
            units = habit.goal.unit;
        } else if (habit.goal.type === 'Duration') {
            units = 'hours';
        } else if (habit.goal.type === 'Checklist') {
            units = 'subtasks';
        }

        return (
            <Text style={{ marginTop: 10, color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 21 : 18 }}>Total {units}</Text>
        );
    };

    const BarColumn = (monthNum) => {
        let value = monthCompletions[monthNum - 1];
        let date = new Date(String(referenceDate.getFullYear()) + '/' + String(monthNum) + '/01');
        let month = getMonthName(date);
        let barHeight;
        if (width > 550) {
            //barHeight = (210 / 31) * value;
            barHeight = (180 / 31) * value;
        } else {
            //barHeight = (180 / 31) * value;
            barHeight = (150 / 31) * value;
        }

        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '600', fontSize: width > 550 ? 14 : 11, marginBottom: width > 550 ? 4 : 2 }}>{value}</Text>
                <View style={{ width: width > 550 ? 18 : 15, height: barHeight, backgroundColor: accentColor, borderRadius: 5 }}/>
                <Text style={{ color: '#999999', fontWeight: '600', fontSize: width > 550 ? 14 : 11, marginBottom: 12, marginTop: 8 }}>{month.slice(0, 3)}</Text>
            </View>
        );
    };

    const pieChartData = [
        {
            name: 'Finished',
            total: pieChartTotals[0],
            color: '#3a9256',
            legendFontColor: 'white',
            legendFontSize: width > 550 ? 17 : 14
        },
        {
            name: 'Partial',
            total: pieChartTotals[1],
            color: '#f2ae26',
            legendFontColor: 'white',
            legendFontSize: width > 550 ? 17 : 14
        },
        {
            name: 'Missed',
            total: pieChartTotals[2],
            color: '#ff1a1a',
            legendFontColor: 'white',
            legendFontSize: width > 550 ? 17 : 14
        }
    ];

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <View style={styles.streakContainer}>
                <Text style={{ marginTop: 10, color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 21 : 18 }}>Streak</Text>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 19 : 16 }}>Current</Text>
                        <Text style={{ marginTop: 5, color: accentColor, fontWeight: 'bold', fontSize: width > 550 ? 20 : 19 }}>{getStreak(habit, 'Current', startingWeekday)} DAYS</Text>
                    </View>
                    <View style={{ height: '85%', width: 2, backgroundColor: Colors.theme, top: 3 }}/>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 19 : 16 }}>Best</Text>
                        <Text style={{ marginTop: 5, color: accentColor, fontWeight: 'bold', fontSize: width > 550 ? 20 : 19 }}>{getStreak(habit, 'Best', startingWeekday)} DAYS</Text>
                    </View>
                </View>
            </View>

            {habit.goal.type != 'Off' ?
                <View style={styles.totalContainer}>
                    {UnitTitle()}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 20 }}>
                        <Text style={styles.timeframeText}>This week</Text>
                        <Text style={[styles.amountText, { color: accentColor }]}>{getTotal(habit, 'Units', 'Week', startingWeekday)}</Text>
                    </View>
                    <View style={styles.horizontalLine}/>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 2 }}>
                        <Text style={styles.timeframeText}>This month</Text>
                        <Text style={[styles.amountText, { color: accentColor }]}>{getTotal(habit, 'Units', 'Month', startingWeekday)}</Text>
                    </View>
                    <View style={styles.horizontalLine}/>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 2 }}>
                        <Text style={styles.timeframeText}>This year</Text>
                        <Text style={[styles.amountText, { color: accentColor }]}>{getTotal(habit, 'Units', 'Year', startingWeekday)}</Text>
                    </View>
                    <View style={styles.horizontalLine}/>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 2 }}>
                        <Text style={styles.timeframeText}>All</Text>
                        <Text style={[styles.amountText, { color: accentColor }]}>{getTotal(habit, 'Units', 'Total', startingWeekday)}</Text>
                    </View>
                </View>
                : null
            }

            <View style={styles.totalContainer}>
                <Text style={{ marginTop: 10, color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 21 : 18 }}>Times completed</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 20 }}>
                    <Text style={styles.timeframeText}>This week</Text>
                    <Text style={[styles.amountText, { color: accentColor }]}>{getTotal(habit, 'Completions', 'Week', startingWeekday)}</Text>
                </View>
                <View style={styles.horizontalLine}/>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 2 }}>
                    <Text style={styles.timeframeText}>This month</Text>
                    <Text style={[styles.amountText, { color: accentColor }]}>{getTotal(habit, 'Completions', 'Month', startingWeekday)}</Text>
                </View>
                <View style={styles.horizontalLine}/>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 2 }}>
                    <Text style={styles.timeframeText}>This year</Text>
                    <Text style={[styles.amountText, { color: accentColor }]}>{getTotal(habit, 'Completions', 'Year', startingWeekday)}</Text>
                </View>
                <View style={styles.horizontalLine}/>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 2 }}>
                    <Text style={styles.timeframeText}>All</Text>
                    <Text style={[styles.amountText, { color: accentColor }]}>{getTotal(habit, 'Completions', 'Total', startingWeekday)}</Text>
                </View>
            </View>

            <View style={styles.barGraphContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 15 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center' }}
                            onPress={() => onTapLeft()}
                        >
                            <View style={{ left: '45%' }}>
                                <AntDesign name='caretleft' size={width > 550 ? 29 : 25} color='white' style={{ left: 1, top: 1 }}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: width > 550 ? 140 : 120 }}>
                        <Text style={{ color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 21 : 18, marginBottom: 2, textAlign: 'center' }}>{referenceDate.getFullYear()}</Text>
                        <Text style={{ color: '#999999', fontSize: width > 550 ? 18 : 15, textAlign: 'center' }}>Times completed</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
                            onPress={() => onTapRight()}
                        >
                            <View style={{ right: '45%' }}>
                                <AntDesign name='caretright' size={width > 550 ? 29 : 25} color='white' style={{ left: 1, top: 1 }}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.barGraphLayout}>
                    {BarColumn(1)}
                    {BarColumn(2)}
                    {BarColumn(3)}
                    {BarColumn(4)}
                    {BarColumn(5)}
                    {BarColumn(6)}
                    {BarColumn(7)}
                    {BarColumn(8)}
                    {BarColumn(9)}
                    {BarColumn(10)}
                    {BarColumn(11)}
                    {BarColumn(12)}
                </View>
            </View>

            <View style={styles.pieChartContainer}>
                <Text style={{ marginVertical: 10, color: 'white', fontFamily: 'roboto-medium', fontSize: width > 550 ? 21 : 18 }}>Finished / Partial / Missed</Text>
                <View>
                    <PieChart
                        data={pieChartData}
                        width={width > 550 ? 420 : 300}
                        height={width > 550 ? 280 : 200}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                        }}
                        accessor={'total'}
                        backgroundColor={'transparent'}
                        paddingLeft={'10'}
                        center={[0, -5]}    // x, y
                        //absolute  // values instead of percentage
                    />
                    <View style={styles.circle}/>
                </View>
            </View>

            <View style={{ height: 20 }}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    streakContainer: {
        width: width > 550 ? '85%' : '90%',
        height: width > 550 ? 140 : 120,
        backgroundColor: Colors.subTheme,
        marginTop: 15,
        borderRadius: 15,
        alignItems: 'center'
    },
    totalContainer: {
        width: width > 550 ? '85%' : '90%',
        height: width > 550 ? Platform.OS === 'android' ? 225 : 210 : Platform.OS === 'android' ? 205 : 190,
        backgroundColor: Colors.subTheme,
        marginTop: 15,
        borderRadius: 15,
        alignItems: 'center'
    },
    timeframeText: {
        color: 'white',
        fontFamily: 'roboto-medium',
        fontSize: width > 550 ? 19 : 16
    },
    amountText: {
        fontFamily: 'roboto-medium',
        fontSize: width > 550 ? 21 : 18
    },
    horizontalLine: {
        width: '90%',
        height: 2,
        backgroundColor: Colors.theme,
        marginVertical: 5
    },
    barGraphContainer: {
        width: width > 550 ? '85%' : '90%',
        //height: width > 550 ? 350 : 300,
        height: width > 550 ? 320 : 270,
        backgroundColor: Colors.subTheme,
        marginTop: 15,
        borderRadius: 15,
        alignItems: 'center'
    },
    barGraphLayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'space-evenly',
        paddingHorizontal: 12
    },
    pieChartContainer: {
        width: width > 550 ? '85%' : '90%',
        height: width > 550 ? 320 : 240,
        backgroundColor: Colors.subTheme,
        marginTop: 15,
        borderRadius: 15,
        alignItems: 'center'
    },
    circle: {
        height: width > 550 ? 100 : 70,
        width: width > 550 ? 100 : 70,
        borderRadius: width > 550 ? 50 : 35,
        backgroundColor: Colors.subTheme,
        position: 'absolute',
        top: width > 550 ? 85 : 60,
        left: width > 550 ? 65 : 50
    }
});

export default StatisticsDetails;