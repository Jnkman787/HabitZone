const addPastDays = (days, referenceDate) => {
    let pastDay = new Date(referenceDate);
    pastDay.setDate(pastDay.getDate() - days);
    return pastDay;
};

const addFutureDays = (days, referenceDate) => {
    let futureDay = new Date(referenceDate);
    futureDay.setDate(futureDay.getDate() + days);
    return futureDay;
};

const generateWeeklyCalendarDates = (pastDays, futureDays, referenceDate) => {
    let dates = [referenceDate];

    for (let i = 1; i <= futureDays; i++) {
        dates[i] = addFutureDays(i, referenceDate);
    }
    dates.reverse();

    for (let i = futureDays + 1; i <= futureDays + pastDays; i++) {
        dates[i] = addPastDays(i - futureDays, referenceDate);
    }
    dates.reverse();

    // dates array will have UTC dates but will get local time zone dates when converted to string
    return dates;
};

const weekdayIndex = (weekday) => {
    if (weekday === 'Sun') { return 0; }
    else if (weekday === 'Mon') { return 1; }
    else if (weekday === 'Tue') { return 2; }
    else if (weekday === 'Wed') { return 3; }
    else if (weekday === 'Thu') { return 4; }
    else if (weekday === 'Fri') { return 5; }
    else if (weekday === 'Sat') { return 6; }
};

// generate weekly calendar based on chosen day of the week
const checkWeekLayout = (referenceDate, startingWeekday) => {
    let weekday = referenceDate.toString().slice(0, 3);
    let weekArray = [];
    let startingWeekdayPosition = weekdayIndex(startingWeekday);
    let weekdayPosition = weekdayIndex(weekday);

    let numDaysBefore = 0;
    if (startingWeekdayPosition > weekdayPosition) {
        numDaysBefore = 6 - startingWeekdayPosition + weekdayPosition + 1;
    } else if (startingWeekdayPosition < weekdayPosition) {
        numDaysBefore = weekdayPosition - startingWeekdayPosition;
    }
    let numDaysAfter = 6 - numDaysBefore;

    weekArray = generateWeeklyCalendarDates(numDaysBefore, numDaysAfter, referenceDate);

    return weekArray;
};

// generate monthly calendar based on current month
const checkMonthLayout = (referenceDate) => {
    let year = referenceDate.getFullYear();
    let month = referenceDate.getMonth() + 1;
    let numDays = new Date(year, month, 0).getDate();
    let startDate = new Date(year, (month - 1));

    let monthArray = [];
    
    for (let i = 0; i < numDays; i++) {
        monthArray.push(addFutureDays(i, startDate));
    }

    return monthArray;
};

// return the day of the week based on the given date
const getWeekday = (date) => {
    let weekdayNum = date.getDay();
    let weekday;

    if (weekdayNum === 0) { weekday = 'Sun'; }
    else if (weekdayNum === 1) { weekday = 'Mon'; }
    else if (weekdayNum === 2) { weekday = 'Tue'; }
    else if (weekdayNum === 3) { weekday = 'Wed'; }
    else if (weekdayNum === 4) { weekday = 'Thu'; }
    else if (weekdayNum === 5) { weekday = 'Fri'; }
    else if (weekdayNum === 6) { weekday = 'Sat'; }

    return weekday;
};

// return the full month name based on the given date
const getMonthName = (date) => {
    let monthNum = date.getMonth();
    let month;

    if (monthNum === 0) { month = 'January'; }
    else if (monthNum === 1) { month = 'February'; }
    else if (monthNum === 2) { month = 'March'; }
    else if (monthNum === 3) { month = 'April'; }
    else if (monthNum === 4) { month = 'May'; }
    else if (monthNum === 5) { month = 'June'; }
    else if (monthNum === 6) { month = 'July'; }
    else if (monthNum === 7) { month = 'August'; }
    else if (monthNum === 8) { month = 'September'; }
    else if (monthNum === 9) { month = 'October'; }
    else if (monthNum === 10) { month = 'November'; }
    else if (monthNum === 11) { month = 'December'; }

    return month;
};

export { generateWeeklyCalendarDates, checkWeekLayout, checkMonthLayout, getWeekday, getMonthName };