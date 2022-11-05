import { createSlice } from '@reduxjs/toolkit';

const settingsInitialState = {
    tutorial: true,                 // disable once the user finishes the tutorial
    startingWeekday: 'Sun',         // save first 3 letters
    finishedPosition: 'Bottom',     // options: Bottom or Keep
    sortType: 'Oldest',             // options: Oldest, Newest, Alphabetical
    vacationMode: false,
    vacationDates: [],
    accentColor: '#cc5200'
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState: settingsInitialState,
    reducers: {
        setTutorial(state, action) {
            state.tutorial = action.payload;
        },
        setStartingWeekday(state, action) {
            state.startingWeekday = action.payload;
        },
        setFinishedPosition(state, action) {
            state.finishedPosition = action.payload;
        },
        setSortType(state, action) {
            state.sortType = action.payload;
        },
        setVacationMode(state) {
            // check if vacationMode is currently active
            if (state.vacationMode === true) {
                // remove today's date from the array of vacation dates
                state.vacationDates.pop();

            } else if (state.vacationMode === false) {
                // add today's date to the array of vacation dates
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                state.vacationDates.push(today);
            }

            // active/de-active vacation mode
            state.vacationMode = !state.vacationMode;
        },
        setAccentColor(state, action) {
            state.accentColor = action.payload;
        }
    }
});

export const { 
    setTutorial,
    setStartingWeekday,
    setFinishedPosition,
    setSortType,
    setVacationMode,
    setAccentColor
} = settingsSlice.actions;
export default settingsSlice.reducer;