import { checkWeekLayout } from '../utils/Weekdays';

const formatSelectedDay = (date) => {
    let selectedDayFormat;
    if ((date.getMonth() + 1) < 10) {
        if (date.getDate() < 10) {
            selectedDayFormat = String(date.getFullYear()) + '/0' + String(date.getMonth() + 1) + '/0' + String(date.getDate());
        } else {
            selectedDayFormat = String(date.getFullYear()) + '/0' + String(date.getMonth() + 1) + '/' + String(date.getDate());
        }
    } else {
        if (date.getDate() < 10) {
            selectedDayFormat = String(date.getFullYear()) + '/' + String(date.getMonth() + 1) + '/0' + String(date.getDate());
        } else {
            selectedDayFormat = String(date.getFullYear()) + '/' + String(date.getMonth() + 1) + '/' + String(date.getDate());
        }
    }
    return selectedDayFormat;
};

const checkFrequencyChanges = (selectedHabit, date) => {
    let updatedFrequency = selectedHabit.frequency;
    if (selectedHabit.changes.frequencies.length > 0) {
        // find the frequency change closest to the selected day that takes place after
        let frequencyIndex;
        for (let i = 0; i < selectedHabit.changes.frequencies.length; i++) {
            let changeDate = new Date(selectedHabit.changes.frequencies[i].date);
            if (date.getFullYear() === changeDate.getFullYear()) {
                if (date.getMonth() === changeDate.getMonth()) {
                    if (date.getDate() < changeDate.getDate()) {
                        frequencyIndex = i;
                        break;
                    }
                } else if (date.getMonth() < changeDate.getMonth()) {
                    frequencyIndex = i;
                    break;
                }
            } else if (date.getFullYear() < changeDate.getFullYear()) {
                frequencyIndex = i;
                break;
            }
        }

        if (frequencyIndex >= 0) {
            updatedFrequency = selectedHabit.changes.frequencies[frequencyIndex].change;
        }
    }
    return updatedFrequency;
};

const checkDays = (currentFrequency, date) => {
    if (currentFrequency.type === 'Days_of_week') {
        for (let i = 0; i < currentFrequency.weekdays.length; i++) {
            if (currentFrequency.weekdays[i] == date.toDateString().slice(0, 3)) { return true; }
        }
    } else if (currentFrequency.type === 'Days_of_month') {
        for (let i = 0; i < currentFrequency.calendarDays.length; i++) {
            if (currentFrequency.calendarDays[i] == date.getDate()) { return true; }
        }
    }
    return false;
};

const checkRepeat = (selectedHabit, currentFrequency, date) => {
    let numDays = 0;
    // start by checking if the habit has any frequency changes
    if (selectedHabit.changes.frequencies.length > 0) {
        // find the date of the frequency change closest to before the selected day
        let frequencyIndex;
        for (let i = 0; i < selectedHabit.changes.frequencies.length; i++) {
            let changeDate = new Date(selectedHabit.changes.frequencies[i].date);
            if (date.getFullYear() === changeDate.getFullYear()) {
                if (date.getMonth() === changeDate.getMonth()) {
                    if (date.getDate() >= changeDate.getDate()) { frequencyIndex = i; }
                } else if (date.getMonth() > changeDate.getMonth()) { frequencyIndex = i }
            } else if (date.getFullYear() > changeDate.getFullYear()) { frequencyIndex = i; }
        }
        
        if (frequencyIndex >= 0) {
            numDays = new Date(formatSelectedDay(date)).getTime() - new Date(selectedHabit.changes.frequencies[frequencyIndex].date).getTime();
        } else {
            numDays = new Date(formatSelectedDay(date)).getTime() - new Date(selectedHabit.startDate).getTime();
        }
    } else {
        // get the time difference between the selected day and the start date
        numDays = new Date(formatSelectedDay(date)).getTime() - new Date(selectedHabit.startDate).getTime();
    }

    // calculate the # of days between the two dates
    numDays = Math.round(numDays / (1000 * 3600 * 24));
    
    if (numDays % parseInt(currentFrequency.repetition) == 0) { return true; }
    else { return false; }
};

const getXDaysIntervalArray = (currentFrequency, date, startingWeekday) => {
    // check X_days frequency time interval
    let intervalArray = [];
    if (currentFrequency.interval === 'Week') {
        // setup an array containing the days for the week of the given date Sun -> Sat
        intervalArray = checkWeekLayout(date, startingWeekday);
    } else if (currentFrequency.interval === 'Month') {
        // setup an array containing the days for the current month
        let numDays = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
        for (let i = 0; i < numDays; i++) {
            let day = new Date(date.getFullYear(), date.getMonth(), (i + 1));
            intervalArray.push(day);
        }
    }
    return intervalArray;
}

const checkXDays = (selectedHabit, currentFrequency, date, startingWeekday) => {
    // check X_days frequency time interval
    let intervalArray = getXDaysIntervalArray(currentFrequency, date, startingWeekday);

    // check if the time interval has already completed (the final value in array is before today)
    let intervalCompleted = false;
    let today = new Date();
    let finalDay = new Date(intervalArray.slice(-1)[0]);
    if (finalDay.getFullYear() < today.getFullYear()) { intervalCompleted = true; }
    else if (finalDay.getFullYear() === today.getFullYear()) {
        if (finalDay.getMonth() < today.getMonth()) { intervalCompleted = true; }
        else if (finalDay.getMonth() === today.getMonth()) {
            if (finalDay.getDate() < today.getDate()) { intervalCompleted = true; }
        }
    }

    let daysCompleted = [];  // list what days were completed to know which days to return true if the time interval is completed
    let timesCompleted = 0;
    // check how many completions there are within this time interval array
    for (let i = 0; i < intervalArray.length; i++) {    // cycle through each day of the week
        for (let x = 0; x < selectedHabit.completion.years.length; x++) {
            if (selectedHabit.completion.years[x].year == intervalArray[i].getFullYear()) {
                for (let y = 0; y < selectedHabit.completion.years[x].months.length; y++) {
                    if (selectedHabit.completion.years[x].months[y].month == (intervalArray[i].getMonth() + 1)) {
                        // check if there are any days yet completed for this month
                        if (selectedHabit.completion.years[x].months[y].days.length > 0) {
                            for (let z = 0; z < selectedHabit.completion.years[x].months[y].days.length; z++) {
                                if (selectedHabit.completion.years[x].months[y].days[z].date == intervalArray[i].getDate()) {
                                    if (selectedHabit.completion.years[x].months[y].days[z].type === 'Completed') {
                                        if (intervalCompleted === false) {
                                            if (selectedHabit.completion.years[x].months[y].days[z].date == date.getDate()) {
                                                return [true, false];
                                            }
                                        }
                                        timesCompleted += 1;
                                        daysCompleted.push(intervalArray[i]);
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
    }

    if (intervalCompleted === false) { return [false, false]; }
    else if (timesCompleted >= currentFrequency.number) {
        for (let i = 0; i < daysCompleted.length; i++) {
            if (date.getDate() == daysCompleted[i].getDate()) { return [true, false]; }
        }
        return [false, false];
    }

    return [false, true];
};

const checkXDaysPieChart = (selectedHabit, currentFrequency, date, startingWeekday) => {
    // check X_days frequency time interval
    let intervalArray = getXDaysIntervalArray(currentFrequency, date, startingWeekday);

    // check if the time interval has already completed (the final value in array is before today)
    let intervalCompleted = false;
    let today = new Date();
    let finalDay = new Date(intervalArray.slice(-1)[0]);
    if (finalDay.getFullYear() < today.getFullYear()) { intervalCompleted = true; }
    else if (finalDay.getFullYear() === today.getFullYear()) {
        if (finalDay.getMonth() < today.getMonth()) { intervalCompleted = true; }
        else if (finalDay.getMonth() === today.getMonth()) {
            if (finalDay.getDate() < today.getDate()) { intervalCompleted = true; }
        }
    }

    let completionType = null;
    let timesCompleted = 0;
    // check how many completions there are within this time interval array
    for (let i = 0; i < intervalArray.length; i++) {    // cycle through each day of the week
        for (let x = 0; x < selectedHabit.completion.years.length; x++) {
            if (selectedHabit.completion.years[x].year == intervalArray[i].getFullYear()) {
                for (let y = 0; y < selectedHabit.completion.years[x].months.length; y++) {
                    if (selectedHabit.completion.years[x].months[y].month == (intervalArray[i].getMonth() + 1)) {
                        // check if there are any days yet completed for this month
                        if (selectedHabit.completion.years[x].months[y].days.length > 0) {
                            for (let z = 0; z < selectedHabit.completion.years[x].months[y].days.length; z++) {
                                if (selectedHabit.completion.years[x].months[y].days[z].date == intervalArray[i].getDate()) {
                                    if (selectedHabit.completion.years[x].months[y].days[z].type === 'Completed') {
                                        timesCompleted += 1;
                                        if (selectedHabit.completion.years[x].months[y].days[z].date == date.getDate()) { completionType = 'Full'; }
                                    } else if (selectedHabit.completion.years[x].months[y].days[z].type === 'Partial') {
                                        // have to include partial in times completed to not overlap them with times missed
                                        timesCompleted += 1;
                                        if (selectedHabit.completion.years[x].months[y].days[z].date == date.getDate()) { completionType = 'Partial'; }
                                    }

                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
    }

    if (intervalCompleted === false) {
        return [completionType, 0]; // days for incomplete time intervals are not yet counted as missed

    } else if (timesCompleted < currentFrequency.number) {
        let timesMissed = currentFrequency.number;

        // check how many days the habit was active during the interval array
        // thus only counting the # of times missed based on the # of opportunities
        // the user had to try and complete the habit during the chosen timeframe
        // will have to compare to both the start date as well as the array of vacation dates

        // start by checking if the start date is in the current interval array
        let habitStartDate = new Date(selectedHabit.startDate);
        for (let i = 0; i < intervalArray.length; i++) {
            if (habitStartDate.getFullYear() === intervalArray[i].getFullYear()) {
                if (habitStartDate.getMonth() === intervalArray[i].getMonth()) {
                    if (habitStartDate.getDate() === intervalArray[i].getDate()) {
                        // if yes, check the number of days included in the interval based on the value of i
                        // and replace that from the set objective
                        let daysIncluded = intervalArray.length - i;
                        if (daysIncluded < currentFrequency.number) { timesMissed = daysIncluded; }
                    }
                }
            }
        }

        timesMissed -= timesCompleted;
        return [completionType, timesMissed];
    };

    // interval completed & timesCompleted >= currentFrequency.number
    return [completionType, 0];
};

const checkCompletions = (habit, date, type) => {
    // look through the recorded completions in reverse order and try to
    // find a recorded completion on the current date
    let completion = habit.completion;
    for (let x = completion.years.length - 1; x >= 0; x--) {
        if (completion.years[x].year != date.getFullYear()) { continue; }
        else {
            for (let y = completion.years[x].months.length - 1; y >= 0; y--) {
                if (completion.years[x].months[y].month != (date.getMonth() + 1)) { continue; }
                else {
                    if (completion.years[x].months[y].days.length == 0) { return false; }
                    else {
                        for (let z = completion.years[x].months[y].days.length - 1; z >= 0; z--) {
                            if (completion.years[x].months[y].days[z].date == date.getDate()) {
                                if (completion.years[x].months[y].days[z].type === 'Completed') { return true; }
                                else if (completion.years[x].months[y].days[z].type === 'Partial') {
                                    if (type === 'PieChart') { return 'Partial'; }
                                }
                                else { return false; }
                            }
                        }
                        return false;
                    }
                }
            }
            return false;
        }
    }
    return false;
};

// streak is based solely on days in which the habit is fully completed
// all that matters is the habit's completion and frequency changes
const getStreak = (habit, type, startingWeekday) => {   // re-use for best streak as well by identifying the type in the arguments
    let numStreak = 0;
    let bestStreak = 0;
    let date = new Date();
    
    // check if the habit is currently active
    if (type === 'Current') {
        if (habit.endDate != null) {
            let endDate = new Date(habit.endDate);
            if (date.getFullYear() > endDate.getFullYear()) { return numStreak; }
            else if (date.getFullYear() === endDate.getFullYear()) {
                if (date.getMonth() > endDate.getMonth()) { return numStreak; }
                else if (date.getMonth() === endDate.getMonth()) {
                    if (date.getDate() >= endDate.getDate()) { return numStreak; }
                }
            }
        }
    }
    
    let numFrequencyChanges = 0;
    let currentFrequency = habit.frequency;

    while (true) {
        // start by getting the habit's current frequency on the current date
        // to minimize the use of the checkFrequencyChanges function, only continue checking
        // for a change in frequency until the all the frequency changes have been found
        if (numFrequencyChanges != habit.changes.frequencies.length) {
            let newFrequency = checkFrequencyChanges(habit, date);
            if (newFrequency != currentFrequency) {
                currentFrequency = newFrequency;
                numFrequencyChanges++;
            }
        }
        
        // based on the type of frequency, call upon a specific function to check
        // if the habit needs to be completed on the current date
        let shouldBeCompleted = false;
        if (currentFrequency.type === 'Days_of_week' || currentFrequency.type === 'Days_of_month') {
            shouldBeCompleted = checkDays(currentFrequency, date);
        } else if (currentFrequency.type === 'Repeat') {
            shouldBeCompleted = checkRepeat(habit, currentFrequency, date);
        } else if (currentFrequency.type === 'X_days') {
            // does not depend on what days it needs to be completed but on the number of times in the selected period
            // also need to check for "extra" completions since the user can complete a habit with this frequency type
            // a greater number of times than the objective if they choose to
            let [isCompleted, isOver] = checkXDays(habit, currentFrequency, date, startingWeekday);

            if (isCompleted === true) { 
                numStreak++;
                if (type === 'Best') {
                    if (numStreak > bestStreak) { bestStreak = numStreak; }
                }
            }            
            
            if (isOver === true) {
                if (type === 'Current') { break; }
                else if (type === 'Best') { numStreak = 0; }
            }
        }
        
        // if yes, check the habit's completions to see if it was completed on this date
        if (shouldBeCompleted === true) {
            if (checkCompletions(habit, date) === true) {
                numStreak++;
                if (type === 'Best') {
                    if (numStreak > bestStreak) { bestStreak = numStreak; }
                }
            }
            else {
                // if the date is today, the streak count shouldn't end if the habit is not yet recorded as completed
                let today = new Date();
                if (date.getFullYear() != today.getFullYear()) { 
                    if (type === 'Current') { break; }
                    else if (type === 'Best') { numStreak = 0; }
                }
                else if (date.getMonth() != today.getMonth()) {
                    if (type === 'Current') { break; }
                    else if (type === 'Best') { numStreak = 0; }
                }
                else if (date.getDate() != today.getDate()) {
                    if (type === 'Current') { break; }
                    else if (type === 'Best') { numStreak = 0; }
                }
            }
        }
        
        // reverse the date by 1 day in the past
        date.setDate(date.getDate() - 1);

        // check if the new date is before the start date
        let startDate = new Date(habit.startDate);
        if (date.getFullYear() < startDate.getFullYear()) { break; }
        else if (date.getFullYear() === startDate.getFullYear()) {
            if (date.getMonth() < startDate.getMonth()) { break; }
            else if (date.getMonth() === startDate.getMonth()) {
                if (date.getDate() < startDate.getDate()) { break; }
            }
        }
    }

    if (type === 'Best') { return bestStreak; }
    return numStreak;
};

// get the total units or completions based on the selected timeframe
const getTotal = (habit, type, timeframe, startingWeekday) => {
    let total = 0;
    let today = new Date();

    // get the first date in each timeframe
    let firstDate;
    if (timeframe === 'Week') {
        let weekArray = checkWeekLayout(today, startingWeekday);
        firstDate = weekArray[0];
    } else if (timeframe === 'Month') {
        let monthArray = [];
        let numDays = new Date(today.getFullYear(), (today.getMonth() + 1), 0).getDate();
        for (let i = 0; i < numDays; i++) {
            let day = new Date(today.getFullYear(), today.getMonth(), (i + 1));
            monthArray.push(day);
        }
        firstDate = monthArray[0];
    } else if (timeframe === 'Year') {
        firstDate = new Date(today.getFullYear(), 0, 1);
    } else if (timeframe === 'Total') {
        firstDate = new Date(habit.startDate);
    }

    // cycle through the habit's completions until the date is earlier than the first date of the timeframe
    let completion = habit.completion;
    for (let x = completion.years.length - 1; x >= 0; x--) {
        if (completion.years[x].year < firstDate.getFullYear()) { break; }
        else {
            for (let y = completion.years[x].months.length - 1; y >= 0; y--) {
                if (completion.years[x].year == firstDate.getFullYear()) {
                    if (completion.years[x].months[y].month < (firstDate.getMonth() + 1)) { break; }
                }

                if (completion.years[x].months[y].days.length == 0) { continue; }
                else {
                    for (let z = completion.years[x].months[y].days.length - 1; z >= 0; z--) {
                        if (completion.years[x].year == firstDate.getFullYear()) {
                            if (completion.years[x].months[y].month == (firstDate.getMonth() + 1)) {
                                if (completion.years[x].months[y].days[z].date < firstDate.getDate()) { break; }
                            }
                        }

                        // check if I'm recording the unit or the completion
                        if (type === 'Completions') {
                            if (completion.years[x].months[y].days[z].type === 'Completed') { total++; }
                        } else if (type === 'Units') {
                            // check if the goal type is the same as the habit's current goal type
                            if (completion.years[x].months[y].days[z].goalType == habit.goal.type) {
                                if (completion.years[x].months[y].days[z].goalType === 'Amount') {
                                    // check if the amount goal units are the same
                                    if (completion.years[x].months[y].days[z].unit == habit.goal.unit) {
                                        total += completion.years[x].months[y].days[z].amount;
                                    }
                                } else if (completion.years[x].months[y].days[z].goalType === 'Duration') {
                                    // record the number of hours and add it to the total
                                    let hours = parseInt(completion.years[x].months[y].days[z].amount.split(':')[0]);
                                    let minutes = parseInt(completion.years[x].months[y].days[z].amount.split(':')[1]);
                                    hours += parseFloat((minutes / 60).toFixed(1));
                                    total += hours;
                                } else if (completion.years[x].months[y].days[z].goalType === 'Checklist') {
                                    // loop through the amount array to check how many subtasks were recorded as true/completed
                                    for (let i = 0; i < completion.years[x].months[y].days[z].amount.length; i++) {
                                        if (completion.years[x].months[y].days[z].amount[i] === true) { total++; }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return total;
};

// return an array of the # of completions for each month for the selected year
const getBarGraphTotals = (habit, year) => {
    let totals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    let completion = habit.completion;
    for (let x = 0; x < completion.years.length; x++) {
        if (completion.years[x].year == year) {
            for (let y = 0; y < completion.years[x].months.length; y++) {
                let monthTotal = 0;
                let monthNum = parseInt(completion.years[x].months[y].month);
                if (completion.years[x].months[y].days.length > 0) {
                    for (let z = 0; z < completion.years[x].months[y].days.length; z++) {
                        if (completion.years[x].months[y].days[z].type === 'Completed') { monthTotal++; }
                    }
                }
                totals[monthNum - 1] = monthTotal;
            }
            break;
        }
    }

    return totals;
};

const getTimesMissedX = (missedXDays, date, currentMonth, datesMissedOther, startingWeekday) => {
    // first add all the values saved for different week intervals and compare values between different month intervals
    let weekTimesMissed = 0;
    let timesMissedX = 0;
    let dontResetValue = false;
    let mostRecentWeekStartDate = null;
    for (let i = 0; i < missedXDays.intervalType.length; i++) {
        if (missedXDays.intervalType[i] === 'Week') {
            // to avoid repeating missed days for weeks that span between 2 different months
            // check if the days of the week span between 2 months; if yes, only use the value if 4 or more 
            // of those days took place in this past month
            if (missedXDays.intervalStartDates[i].getMonth() != currentMonth) {     // started the month before
                // check the number of days of the previous month
                let numDays = new Date(date.getFullYear(), currentMonth, 0).getDate();
                let daysOverlap = numDays - missedXDays.intervalStartDates[i].getDate() + 1;
                if (daysOverlap > 3) {
                    dontResetValue = true;
                    continue;
                }
            } else if (missedXDays.intervalEndDates[i].getMonth() != currentMonth) {    // ended the month after
                let daysOverlap = missedXDays.intervalEndDates[i].getDate();
                if (daysOverlap > 3) { continue; }
            }
            
            // check if there are any other weeks with overlapping time intervals and ensure I only
            // add the largest times missed value among the overlapping weeks one time to the month's total
            let largestWeekTimesX = missedXDays.timesMissed[i];
            for (let x = 0; x < missedXDays.intervalType.length; x++) {
                if (missedXDays.intervalType[x] === 'Week') {
                    if (missedXDays.intervalStartDates[x].getFullYear() === missedXDays.intervalStartDates[i].getFullYear()) {
                        if (missedXDays.intervalStartDates[x].getMonth() === missedXDays.intervalStartDates[i].getMonth()) {
                            if (missedXDays.intervalStartDates[x].getDate() === missedXDays.intervalStartDates[i].getDate()) {
                                if (missedXDays.timesMissed[x] > largestWeekTimesX) { largestWeekTimesX = missedXDays.timesMissed[x]; }
                            }
                        }
                    }
                }
            }

            // check if any other frequency missed days overlap with this week of missed X_days
            let intervalArray = checkWeekLayout(missedXDays.intervalStartDates[i], startingWeekday);
            for (let x = 0; x < intervalArray.length; x++) {
                for (let y = 0; y < datesMissedOther.length; y++) {
                    if (intervalArray[x].getFullYear() === datesMissedOther[y].getFullYear()) {
                        if (intervalArray[x].getMonth() === datesMissedOther[y].getMonth()) {
                            if (intervalArray[x].getDate() === datesMissedOther[y].getDate()) {
                                // remove one missed day each time there is an overlap
                                largestWeekTimesX -= 1;
                                break;
                            }
                        }
                    }
                }
            }

            if (mostRecentWeekStartDate === null) {
                if (largestWeekTimesX > 0) { weekTimesMissed += largestWeekTimesX; }
                mostRecentWeekStartDate = new Date(missedXDays.intervalStartDates[i]);
            } else {
                if (mostRecentWeekStartDate.getFullYear() === missedXDays.intervalStartDates[i].getFullYear()) {
                    if (mostRecentWeekStartDate.getMonth() === missedXDays.intervalStartDates[i].getMonth()) {
                        if (mostRecentWeekStartDate.getDate() === missedXDays.intervalStartDates[i].getDate()) {
                            continue;
                        }
                    }
                }
                if (largestWeekTimesX > 0) { weekTimesMissed += largestWeekTimesX; }
                mostRecentWeekStartDate = new Date(missedXDays.intervalStartDates[i]);
            }
        } else if (missedXDays.intervalType[i] === 'Month') {
            if (missedXDays.timesMissed[i] > timesMissedX) {
                timesMissedX = missedXDays.timesMissed[i];
            }
        }
    }

    // compare both values and use the largest to determine the number of additional missed days for the month
    if (weekTimesMissed > timesMissedX) { timesMissedX = weekTimesMissed; }
    else {
        timesMissedX - datesMissedOther.length;     // only need to subtract other missed days if using the month X_days total
    }

    return [timesMissedX, dontResetValue];
};

const getPieChartTotals = (habit, startingWeekday) => {
    let numTotals = [0, 0, 0];
    let date = new Date();
    let currentMonth = new Date().getMonth();

    let numFrequencyChanges = 0;
    let currentFrequency = habit.frequency;

    // used for X_days frequency type
    // save the # of times missed by month
    let missedXDays = {
        intervalType: [],
        timesMissed: [],
        intervalStartDates: [],
        intervalEndDates: []
    };
    let datesMissedOther = [];  // dates missed by any other frequency type

    if (currentFrequency.type === 'X_days') {
        missedXDays.intervalType.push(currentFrequency.interval);
        missedXDays.timesMissed.push(0);
        let intervalArray = getXDaysIntervalArray(currentFrequency, date, startingWeekday);
        let intervalStartDate = new Date(intervalArray[0]);
        let intervalEndDate = new Date(intervalArray.slice(-1)[0]);
        intervalStartDate.setHours(0, 0, 0, 0);
        intervalEndDate.setHours(0, 0, 0, 0);
        missedXDays.intervalStartDates.push(intervalStartDate);
        missedXDays.intervalEndDates.push(intervalEndDate);
    }

    let loopFinished = false;
    while (true) {
        // start by geting the habit's current frequency on the current date
        // to minimize the use of the checkFrequencyChanges function, only continue checking
        // for a change in frequency until the all the frequency changes have been found
        if (numFrequencyChanges != habit.changes.frequencies.length) {
            let newFrequency = checkFrequencyChanges(habit, date);
            if (newFrequency != currentFrequency) {
                if (newFrequency.type === 'X_days') {
                    // add a new set of values to missedXDays
                    missedXDays.intervalType.push(newFrequency.interval);
                    missedXDays.timesMissed.push(0);
                    let intervalArray = getXDaysIntervalArray(newFrequency, date, startingWeekday);
                    let intervalStartDate = new Date(intervalArray[0]);
                    let intervalEndDate = new Date(intervalArray.slice(-1)[0]);
                    intervalStartDate.setHours(0, 0, 0, 0);
                    intervalEndDate.setHours(0, 0, 0, 0);
                    missedXDays.intervalStartDates.push(intervalStartDate);
                    missedXDays.intervalEndDates.push(intervalEndDate);
                }
                currentFrequency = newFrequency;
                numFrequencyChanges++;
            }
        }

        // based on the type of frequency, call upon a specific function to check
        // if the habit needs to be completed on the current date
        let shouldBeCompleted = false;
        if (currentFrequency.type === 'Days_of_week' || currentFrequency.type === 'Days_of_month') {
            shouldBeCompleted = checkDays(currentFrequency, date);
        } else if (currentFrequency.type === 'Repeat') {
            shouldBeCompleted = checkRepeat(habit, currentFrequency, date);
        } else if (currentFrequency.type === 'X_days') {
            // check if the habit was fully or partially completed; otherwise, if the time interval has already completed,
            // check if the times completed in the intervalArray is lower than the goal for times completed, and by how many
            let [completion, timesMissed] = checkXDaysPieChart(habit, currentFrequency, date, startingWeekday);

            if (completion === 'Full') { numTotals[0] += 1; }
            else if (completion === 'Partial') { numTotals[1] += 1; }
            
            if (timesMissed > 0) {
                // replace final value in timesMissed array with the # of times missed
                if (missedXDays.timesMissed.slice(-1)[0] != timesMissed) {
                    let position = missedXDays.timesMissed.length - 1;
                    missedXDays.timesMissed[position] = timesMissed;
                }
            }
        }

        // if yes, check the habit's completions to see if it was fully/partial completed or missed on this date
        if (shouldBeCompleted === true) {
            let check = checkCompletions(habit, date, 'PieChart');  // prevents having to check the completions more than once
            if (check === true) { numTotals[0] += 1; }
            else if (check === 'Partial') { numTotals[1] += 1; }
            else {
                // if the date is today, the completion should't yet count as missed
                let today = new Date();
                let missedDay = new Date(date);
                missedDay.setHours(0, 0, 0, 0);
                if (date.getFullYear() != today.getFullYear()) { 
                    numTotals[2] += 1;
                    datesMissedOther.push(missedDay);
                } else if (date.getMonth() != today.getMonth()) { 
                    numTotals[2] += 1;
                    datesMissedOther.push(missedDay);
                } else if (date.getDate() != today.getDate()) { 
                    numTotals[2] += 1;
                    datesMissedOther.push(missedDay);
                }
            }
        }

        // reverse the date by 1 day in the past
        date.setDate(date.getDate() - 1);
        
        // start by checking if the new date is before the start date
        let startDate = new Date(habit.startDate);
        if (date.getFullYear() < startDate.getFullYear()) { loopFinished = true; }
        else if (date.getFullYear() === startDate.getFullYear()) {
            if (date.getMonth() < startDate.getMonth()) { loopFinished = true; }
            else if (date.getMonth() === startDate.getMonth()) {
                if (date.getDate() < startDate.getDate()) { loopFinished = true; }
            }
        }

        if (loopFinished === true) {
            // check if there are any values saved in MissedXDays that haven't yet been added to the missed days
            if (missedXDays.intervalType.length > 0) {
                let [timesMissedX, dontResetValue] = getTimesMissedX(missedXDays, date, currentMonth, datesMissedOther, startingWeekday);
                if (timesMissedX > 0) { numTotals[2] += timesMissedX; }
            }

            break;  // exit the while loop
        } else {
            // next check if the new date is entering a new month, if yes, add the missed days for the X_days frequency
            if (date.getMonth() != currentMonth) {
                // check if there are any values saved in MissedXDays
                if (missedXDays.intervalType.length > 0) {
                    let [timesMissedX, dontResetValue] = getTimesMissedX(missedXDays, date, currentMonth, datesMissedOther, startingWeekday);
                    if (timesMissedX > 0) { numTotals[2] += timesMissedX; }

                    // remove all values from object except last
                    let lastValue = missedXDays.intervalType.slice(-1)[0];
                    missedXDays.intervalType = [];
                    missedXDays.intervalType.push(lastValue);
                    lastValue = missedXDays.timesMissed.slice(-1)[0];
                    missedXDays.timesMissed = [];
                    missedXDays.timesMissed.push(lastValue);
                    lastValue = missedXDays.intervalStartDates.slice(-1)[0];
                    missedXDays.intervalStartDates = [];
                    missedXDays.intervalStartDates.push(lastValue);
                    lastValue = missedXDays.intervalEndDates.slice(-1)[0];
                    missedXDays.intervalEndDates = [];
                    missedXDays.intervalEndDates.push(lastValue);

                    // reset all values for the new month
                    if (dontResetValue === false) {
                        missedXDays.timesMissed[0] = 0;
                        datesMissedOther = [];
                    }
                    
                    // check the X_days frequency type of the final value listed in the object array
                    let intervalArray = [];
                    if (missedXDays.intervalType[0] === 'Week') {
                        intervalArray = checkWeekLayout(date, startingWeekday);
                    } else if (missedXDays.intervalType[0] === 'Month') {
                        let numDays = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
                        for (let i = 0; i < numDays; i++) {
                            let day = new Date(date.getFullYear(), date.getMonth(), (i + 1));
                            intervalArray.push(day);
                        }
                    }

                    let intervalStartDate = new Date(intervalArray[0]);
                    let intervalEndDate = new Date(intervalArray.slice(-1)[0]);
                    intervalStartDate.setHours(0, 0, 0, 0);
                    intervalEndDate.setHours(0, 0, 0, 0);
                    missedXDays.intervalStartDates[0] = intervalStartDate;
                    missedXDays.intervalEndDates[0] = intervalEndDate;

                    // update current month
                    currentMonth = new Date(date).getMonth();
                }
            } else {
                // check if the current frequency is week interval X_days
                if (currentFrequency.type === 'X_days') {
                    if (currentFrequency.interval === 'Week') {
                        // check if the new date is entering a new week based on the week interval
                        let previousDay = new Date(date);
                        previousDay.setDate(previousDay.getDate() + 1);
                        let intervalArray = getXDaysIntervalArray(currentFrequency, previousDay, startingWeekday);
                        for (let i = 0; i < intervalArray.length; i++) {
                            if (intervalArray[i].getFullYear() === date.getFullYear()) {
                                if (intervalArray[i].getMonth() === date.getMonth()) {
                                    if (intervalArray[i].getDate() === date.getDate()) { break; }
                                }
                            }

                            if (i === (intervalArray.length - 1)) {      // previous intervalArray timeframe has now completed
                                // add a new week to the MissedXDays object in which to store the times missed value
                                missedXDays.intervalType.push(currentFrequency.interval);
                                missedXDays.timesMissed.push(0);
                                intervalArray = getXDaysIntervalArray(currentFrequency, date, startingWeekday);
                                let intervalStartDate = new Date(intervalArray[0]);
                                let intervalEndDate = new Date(intervalArray.slice(-1)[0]);
                                intervalStartDate.setHours(0, 0, 0, 0);
                                intervalEndDate.setHours(0, 0, 0, 0);
                                missedXDays.intervalStartDates.push(intervalStartDate);
                                missedXDays.intervalEndDates.push(intervalEndDate);
                            }
                        }
                    }
                }
            }
        }
    }

    return numTotals;
};

export { getStreak, getTotal, getBarGraphTotals, getPieChartTotals };