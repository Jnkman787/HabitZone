// Day models

// green = completed
// yellow = partial
// red = missed

// Completed or Skipped (maybe don't include skipped)
class Day1 {
    constructor(type, goalType, date, amount, unit) {
        this.type = type;
        this.goalType = goalType;
        this.date = date;
        this.amount = amount;   // value of null for Off goal
        this.unit = unit;       // value of null for any goal other than Amount
    }
}

// Partial
class Day2 {
    constructor(type, goalType, date, amount, unit) {
        this.type = type;
        this.goalType = goalType;
        this.date = date;
        this.amount = amount;
        this.unit = unit;       // value of null for any goal other than Amount
    }
}

// Month model
class Month {
    constructor(month, days) {
        this.month = month;
        this.days = days;
    }
}

// Year model
class Year {
    constructor(year, months) {
        this.year = year;
        this.months = months;
    }
}

export { Day1, Day2, Month, Year };