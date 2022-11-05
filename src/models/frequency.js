// Days of the week
class Frequency1 {
    constructor(type, weekdays) {
        this.type = type;
        this.weekdays = weekdays;   // array of weekdays
    }
}

// Days of the month
class Frequency2 {
    constructor(type, calendarDays) {
        this.type = type;
        this.calendarDays = calendarDays;   // array of numbers
    }
}

// Repeat
class Frequency3 {
    constructor(type, repetition) {
        this.type = type;
        this.repetition = repetition;
    }
}

// X days per
class Frequency4 {
    constructor(type, interval, number) {
        this.type = type;
        this.interval = interval;
        this.number = number;
    }
}

export { Frequency1, Frequency2, Frequency3, Frequency4 };