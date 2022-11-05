class Change {
    constructor(date, change) {
        this.date = date;
        this.change = change;
    }
}

// Off
class ChangeGoal1 {
    constructor(type) {
        this.type = type;
    }
}

// Amount
// only add a changeGoal2 if the type or target is changed, not just the unit
class ChangeGoal2 {
    constructor(type, target, unit) {
        this.type = type;
        this.target = target;
        this.unit = unit;
    }
}

// Duration
class ChangeGoal3 {
    constructor(type, hours, minutes) {
        this.type = type;
        this.hours = hours;
        this.minutes = minutes;
    }
}

// Checklist
class ChangeGoal4 {
    constructor(type, subtasks) {
        this.type = type;
        this.subtasks = subtasks;
    }
}

// Days of the week
class ChangeFrequency1 {
    constructor(type, weekdays) {
        this.type = type;
        this.weekdays = weekdays;   // array of weekdays
    }
}

// Days of the month
class ChangeFrequency2 {
    constructor(type, calendarDays) {
        this.type = type;
        this.calendarDays = calendarDays;   // array of numbers
    }
}

// Repeat
class ChangeFrequency3 {
    constructor(type, repetition) {
        this.type = type;
        this.repetition = repetition;
    }
}

// X days per
class ChangeFrequency4 {
    constructor(type, interval, number) {
        this.type = type;
        this.interval = interval;
        this.number = number;
    }
}

export { Change, ChangeGoal1, ChangeGoal2, ChangeGoal3, ChangeGoal4, ChangeFrequency1, ChangeFrequency2, ChangeFrequency3, ChangeFrequency4 };