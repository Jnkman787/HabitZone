import { createSlice } from '@reduxjs/toolkit';

import { Goal1, Goal2, Goal3, Goal4 } from '../models/goal';
import { Frequency1, Frequency2, Frequency3, Frequency4 } from '../models/frequency';

const setupInitialState = {
    category: '',
    color: '',
    goal: {},
    frequency: {},
    startDate: new Date(),
    endDate: null,
    notifications: {
        enabled: false,
        time: null
    }
};

const setupSlice = createSlice({
    name: 'setup',
    initialState: setupInitialState,
    reducers: {
        setCategory(state, action) {
            state.category = action.payload.category;
            state.color = action.payload.color;
        },
        setGoal(state, action) {
            const goalType = action.payload.goalType;

            let newGoal;

            if (goalType === 'Off') {
                newGoal = new Goal1(
                    goalType
                );
            } else if (goalType === 'Amount') {
                newGoal = new Goal2(
                    goalType,
                    action.payload.target,
                    action.payload.unit
                );
            } else if (goalType === 'Duration') {
                newGoal = new Goal3(
                    goalType,
                    action.payload.hours,
                    action.payload.minutes
                );
            } else if (goalType === 'Checklist') {
                newGoal = new Goal4(
                    goalType,
                    action.payload.newSubtasks
                );
            }

            state.goal = newGoal;
        },
        setFrequency(state, action) {
            const frequencyType = action.payload.frequencyType;

            let newFrequency;

            if (frequencyType === 'Days_of_week') {
                newFrequency = new Frequency1(
                    frequencyType,
                    action.payload.weekdays
                );
            } else if (frequencyType === 'Days_of_month') {
                newFrequency = new Frequency2(
                    frequencyType,
                    action.payload.calendarDays
                );
            } else if (frequencyType === 'Repeat') {
                newFrequency = new Frequency3(
                    frequencyType,
                    action.payload.repetition
                );
            } else if (frequencyType === 'X_days') {
                newFrequency = new Frequency4(
                    frequencyType,
                    action.payload.interval,
                    action.payload.number
                );
            }

            state.frequency = newFrequency;
        },
        setStartDate(state, action) {
            state.startDate = action.payload;
        },
        setEndDate(state, action) {
            state.endDate = action.payload;
        },
        setNotifications(state, action) {
            state.notifications.enabled = action.payload.enabled;
            state.notifications.time = action.payload.time;
        }
    }
});

export const { setCategory, setGoal, setFrequency, setStartDate, setEndDate, setNotifications } = setupSlice.actions;
export default setupSlice.reducer;