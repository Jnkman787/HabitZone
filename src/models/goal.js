// Off
class Goal1 {
    constructor(type) {
        this.type = type;
    }
}

// Amount
class Goal2 {
    constructor(type, target, unit) {
        this.type = type;
        this.target = target;
        this.unit = unit;
    }
}

// Duration
class Goal3 {
    constructor(type, hours, minutes) {
        this.type = type;
        this.hours = hours;
        this.minutes = minutes;
    }
}

// Checklist
class Goal4 {
    constructor(type, subtasks) {
        this.type = type;
        this.subtasks = subtasks;
    }
}

export { Goal1, Goal2, Goal3, Goal4 };