class Habit {
    constructor(id, name, category, color, goal, frequency, notes, startDate, endDate, notifications, favorite, completion, changes) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.color = color;
        this.goal = goal;
        this.frequency = frequency;
        this.notes = notes;
        this.startDate = startDate;
        this.endDate = endDate;
        this.notifications = notifications;
        this.favorite = favorite;
        this.completion = completion;
        this.changes = changes;
    }
}

export default Habit;