import { createSlice } from '@reduxjs/toolkit';

import Habit from '../models/habit';
import { Day1, Day2, Month, Year } from '../models/completion';
import { Change, ChangeGoal1, ChangeGoal2, ChangeGoal3, ChangeGoal4, ChangeFrequency1, ChangeFrequency2, ChangeFrequency3, ChangeFrequency4 } from '../models/changes';

const habitSlice = createSlice({
    name: 'habits',
    initialState: {
        habits: []
    },
    reducers: {
        addHabit(state, action) {
            const habitDetails = action.payload;

            // start by setting the latest id to zero and update if the habit list isn't empty
            let latest_id = 0;
            if (state.habits.length > 0) {
                latest_id = state.habits[state.habits.length - 1].id;
                latest_id += 1;
            }

            // setup a new completion data bank
            let newMonthModel = new Month(
                habitDetails.habitStartDate.substring(5, 7),
                []
            );
            let newYearModel = new Year(
                habitDetails.habitStartDate.substring(0, 4),
                [newMonthModel]
            );
            let habitCompletion = {
                years: [newYearModel]
            };

            let habitChanges = {
                goals: [],
                frequencies: []
            };

            const newHabit = new Habit(
                latest_id,
                habitDetails.habitName,
                habitDetails.habitCategory,
                habitDetails.categoryColor,
                habitDetails.habitGoal,
                habitDetails.habitFrequency,
                habitDetails.habitNotes,
                habitDetails.habitStartDate,
                habitDetails.habitEndDate,
                habitDetails.habitNotifications,
                false,   // all habits start with favorite set as false
                habitCompletion,
                habitChanges

                // only record days partially/fully completed or skipped
                // if a day is missed, the calendar simply won't be able to find the date in the completion data bank
                // and will therefore mark it as missed (this will minimize the amount of data tracking necessary)
            );

            state.habits.push(newHabit);
        },
        addHabitGoalChange(state, action) {
            const goalChangeHabit = state.habits.find(habit => habit.id === action.payload.habitId);
            const goal = action.payload.goalDetails;

            const checkGoalType = () => {
                let newGoal;
                if (goal.type === 'Off') {
                    newGoal = new ChangeGoal1(
                        goal.type
                    );
                } else if (goal.type === 'Amount') {
                    newGoal = new ChangeGoal2(
                        goal.type,
                        goal.target,
                        goal.unit
                    );
                } else if (goal.type === 'Duration') {
                    newGoal = new ChangeGoal3(
                        goal.type,
                        goal.hours,
                        goal.minutes
                    );
                } else if (goal.type === 'Checklist') {
                    newGoal = new ChangeGoal4(
                        goal.type,
                        goal.subtasks
                    );
                }

                return newGoal;
            };

            let newGoalChange = new Change(
                action.payload.date,
                checkGoalType()
            );

            // check if there are yet any goal changes
            if (goalChangeHabit.changes.goals.length > 0) {
                // check if there is already a goal change on the current date
                for (let i = 0; i < goalChangeHabit.changes.goals.length; i++) {
                    if (action.payload.date === goalChangeHabit.changes.goals[i].date) {
                        // goal change already exists
                        break;
                    } else if (i === (goalChangeHabit.changes.goals.length - 1)) {
                        goalChangeHabit.changes.goals.push(newGoalChange);
                    }
                }
            } else {
                goalChangeHabit.changes.goals.push(newGoalChange);
            }
        },
        removeHabitGoalChange(state, action) {
            const goalChangeHabit = state.habits.find(habit => habit.id === action.payload.habitId);
            goalChangeHabit.changes.goals.splice((goalChangeHabit.changes.goals.length - 1), 1);
        },
        addHabitFrequencyChange(state, action) {
            const frequencyChangeHabit = state.habits.find(habit => habit.id === action.payload.habitId);
            const frequency = action.payload.frequencyDetails;

            const checkFrequencyType = () => {
                let newFrequency;
                if (frequency.type === 'Days_of_week') {
                    newFrequency = new ChangeFrequency1(
                        frequency.type,
                        frequency.weekdays
                    );
                } else if (frequency.type === 'Days_of_month') {
                    newFrequency = new ChangeFrequency2(
                        frequency.type,
                        frequency.calendarDays
                    );
                } else if (frequency.type === 'Repeat') {
                    newFrequency = new ChangeFrequency3(
                        frequency.type,
                        frequency.repetition
                    );
                } else if (frequency.type === 'X_days') {
                    newFrequency = new ChangeFrequency4(
                        frequency.type,
                        frequency.interval,
                        frequency.number
                    );
                }

                return newFrequency;
            };

            let newFrequencyChange = new Change(
                action.payload.date,
                checkFrequencyType()
            );

            // check if there are yet any frequency changes
            if (frequencyChangeHabit.changes.frequencies.length > 0) {
                // check if there is already a frequency change on the current date
                for (let i = 0; i < frequencyChangeHabit.changes.frequencies.length; i++) {
                    if (action.payload.date === frequencyChangeHabit.changes.frequencies[i].date) {
                        // frequency change already exists
                        break;
                    } else if (i === (frequencyChangeHabit.changes.frequencies.length - 1)) {
                        frequencyChangeHabit.changes.frequencies.push(newFrequencyChange);
                    }
                }
            } else {
                frequencyChangeHabit.changes.frequencies.push(newFrequencyChange);
            }
        },
        removeHabitFrequencyChange(state, action) {
            const frequencyChangeHabit = state.habits.find(habit => habit.id === action.payload.habitId);
            frequencyChangeHabit.changes.frequencies.splice((frequencyChangeHabit.changes.frequencies.length - 1), 1);
        },
        editHabit(state, action) {
            const updatedHabit = state.habits.find(habit => habit.id === action.payload.habitId);
            const updatedHabitDetails = action.payload;
            
            updatedHabit.id = updatedHabitDetails.habitId;
            updatedHabit.name = updatedHabitDetails.habitName;
            updatedHabit.category = updatedHabitDetails.habitCategory;
            updatedHabit.color = updatedHabitDetails.categoryColor;
            updatedHabit.goal = updatedHabitDetails.habitGoal;
            updatedHabit.frequency = updatedHabitDetails.habitFrequency;
            updatedHabit.notes = updatedHabitDetails.habitNotes;
            updatedHabit.startDate = updatedHabitDetails.habitStartDate;
            updatedHabit.endDate = updatedHabitDetails.habitEndDate;
            updatedHabit.notifications = updatedHabitDetails.habitNotifications;
            updatedHabit.favorite = updatedHabitDetails.favoriteEnabled;
            updatedHabit.completion = updatedHabitDetails.habitCompletion;
            updatedHabit.changes = updatedHabitDetails.habitChanges;
        },
        deleteHabit(state, action) {
            state.habits.splice(state.habits.findIndex(habit => habit.id === action.payload), 1);
        },
        switchFavorite(state, action) {
            const favoriteHabit = state.habits.find(habit => habit.id === action.payload);
            favoriteHabit.favorite = !favoriteHabit.favorite;
        },
        updateNotification(state, action) {
            const notificationHabit = state.habits.find(habit => habit.id === action.payload.habitId);
            notificationHabit.notifications = action.payload.notification;
        },
        markHabitCompleted(state, action) {
            const completedHabit = state.habits.find(habit => habit.id === action.payload.habitId);
            const date = action.payload.date;

            const checkMonth = () => {
                let monthNum;
                if (date.monthNumber <= 8) {
                    monthNum = '0' + String(date.monthNumber + 1);
                } else {
                    monthNum = String(date.monthNumber + 1);
                }

                let newMonth = new Month(
                    monthNum,
                    [checkDayType()]
                );

                return newMonth;
            };

            // need to check goal type; if not "Off", include amount for completed
            // if goal type is "Amount", also include unit for both partial and full completions
            const checkDayType = () => {
                let newDay;
                if (action.payload.dayType === 'Completed') {
                    let amount = null;
                    let unit = null;

                    if (action.payload.goal.type === 'Amount') {
                        amount = parseInt(action.payload.goal.target);
                        unit = action.payload.goal.unit;
                    } else if (action.payload.goal.type === 'Duration') {
                        let hours = action.payload.goal.hours;
                        let minutes = action.payload.goal.minutes;
                        amount = hours + ':' + minutes;
                    } else if (action.payload.goal.type === 'Checklist') {
                        amount = [];
                        for (let i = 0; i < action.payload.goal.subtasks.length; i++) {
                            amount.push(true);
                        }
                    }

                    newDay = new Day1(
                        action.payload.dayType,
                        action.payload.goal.type,
                        date.day,
                        amount,
                        unit
                    );
                } else if (action.payload.dayType === 'Partial') {
                    let unit = null;

                    if (action.payload.goal.type === 'Amount') {
                        unit = action.payload.goal.unit;
                    }

                    newDay = new Day2(
                        action.payload.dayType,
                        action.payload.goal.type,
                        date.day,
                        action.payload.amount,
                        unit
                    );
                }

                return newDay;
            };

            // check if the year or month exist in the habit's completion object, then add the calendar day
            for (let x = 0; x < completedHabit.completion.years.length; x++) {
                if (date.year == completedHabit.completion.years[x].year) {
                    for (let y = 0; y < completedHabit.completion.years[x].months.length; y++) {
                        if ((date.monthNumber + 1) == completedHabit.completion.years[x].months[y].month) {
                            // after finding the correct year & month, check if the calendar day already exists
                            // thereby indicating if the day needs to be added or modified
                            // first check if there are any yet completed this month
                            if (completedHabit.completion.years[x].months[y].days.length > 0) {
                                for (let z = 0; z < completedHabit.completion.years[x].months[y].days.length; z++) {
                                    if (date.day == completedHabit.completion.years[x].months[y].days[z].date) {
                                        completedHabit.completion.years[x].months[y].days[z] = checkDayType();
                                        break;
                                    } else if (z === (completedHabit.completion.years[x].months[y].days.length - 1)) {
                                        completedHabit.completion.years[x].months[y].days.push(checkDayType());
                                    }
                                }
                                break;
                            } else {
                                completedHabit.completion.years[x].months[y].days.push(checkDayType());
                                break;
                            }
                        } else if (y === (completedHabit.completion.years[x].months.length - 1)) {
                            // the month was not found in the for loop, thus add the month in the selected year
                            completedHabit.completion.years[x].months.push(checkMonth());
                        }
                    }
                    break;
                } else if (x === (completedHabit.completion.years.length - 1)) {
                    // the year was not found in the for loop, thus add the year & month in the completion object
                    let newYear = new Year(
                        String(date.year),
                        [checkMonth()]
                    );

                    completedHabit.completion.years.push(newYear);
                }
            }
        },
        markHabitUncompleted(state, action) {
            const uncompletedHabit = state.habits.find(habit => habit.id === action.payload.habitId);
            const date = action.payload.date;

            for (let x = 0; x < uncompletedHabit.completion.years.length; x++) {
                if (date.year == uncompletedHabit.completion.years[x].year) {
                    for (let y = 0; y < uncompletedHabit.completion.years[x].months.length; y++) {
                        if ((date.monthNumber + 1) == uncompletedHabit.completion.years[x].months[y].month) {
                            for (let z = 0; z < uncompletedHabit.completion.years[x].months[y].days.length; z++) {
                                if (date.day == uncompletedHabit.completion.years[x].months[y].days[z].date) {
                                    uncompletedHabit.completion.years[x].months[y].days.splice(z, 1);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        },
        sortHabitCompletion(state, action) {
            const sortedHabit = state.habits.find(habit => habit.id === action.payload.habitId);

            // sort the years, months and days
            sortedHabit.completion.years.sort((a,b) => parseInt(a.year) - parseInt(b.year));

            for (let x = 0; x < sortedHabit.completion.years.length; x++) {
                sortedHabit.completion.years[x].months.sort((a,b) => parseInt(a.month) - parseInt(b.month));
                for (let y = 0; y < sortedHabit.completion.years[x].months.length; y++) {
                    sortedHabit.completion.years[x].months[y].days.sort((a,b) => parseInt(a.date) - parseInt(b.date));
                }
            }
        },
        resetHabit(state, action) {
            const selectedHabit = state.habits.find(habit => habit.id === action.payload);

            let today = new Date();
            let newStartDate;

            // format today's date for the new start date of the habit
            if (today.getMonth() < 9) {
                if (today.getDate() < 10) {
                    newStartDate = today.getFullYear() + '/0' + (today.getMonth() + 1) + '/0' + today.getDate();
                } else {
                    newStartDate = today.getFullYear() + '/0' + (today.getMonth() + 1) + '/' + today.getDate();
                }
            } else if (today.getDate() < 10) {
                newStartDate = today.getFullYear() + '/' + (today.getMonth() + 1) + '/0' + today.getDate();
            } else {
                newStartDate = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
            }
            
            // setup a new completion data bank
            let newMonthModel = new Month(
                newStartDate.substring(5, 7),
                []
            );
            let newYearModel = new Year(
                newStartDate.substring(0, 4),
                [newMonthModel]
            );
            let habitCompletion = {
                years: [newYearModel]
            };

            selectedHabit.startDate = newStartDate;
            selectedHabit.endDate = null;
            selectedHabit.completion = habitCompletion;
        },
        clearHabits(state) {
            state.habits = [];
        }
    }
});

export const { 
    addHabit,
    addHabitGoalChange,
    removeHabitGoalChange,
    addHabitFrequencyChange,
    removeHabitFrequencyChange,
    editHabit,
    deleteHabit,
    switchFavorite,
    updateNotification,
    markHabitCompleted,
    markHabitUncompleted,
    sortHabitCompletion,
    resetHabit,
    clearHabits
} = habitSlice.actions;
export default habitSlice.reducer;