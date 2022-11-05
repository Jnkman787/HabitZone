import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    })
});

const displayHabitNotification = (habit, partial, id) => {
    let bodyText = 'Just a reminder to complete this habit today';

    if (habit.goal.type === 'Amount') {
        let remainder = parseInt(habit.goal.target);
        if (partial != null) {
            remainder -= parseInt(partial);
            bodyText = 'Just a reminder that you have ' + remainder + ' ' + habit.goal.unit + ' left to complete today out of ' + habit.goal.target;
        }
        else {
            bodyText = 'Just a reminder that you have ' + habit.goal.target + ' ' + habit.goal.unit + ' left to complete today';
        }

    } else if (habit.goal.type === 'Duration') {
        let remainingHours = habit.goal.hours;
        let remainingMinutes = habit.goal.minutes;
        if (partial != null) {
            remainingHours -= parseInt(partial.split(':')[0]);
            remainingMinutes -= parseInt(partial.split(':')[1]);

            if (habit.goal.hours > 0) {
                if (habit.goal.minutes > 0) {
                    bodyText = 'Just a reminder that you have ' + remainingHours + 'h and ' + remainingMinutes + 'm left to complete today out of ' + habit.goal.hours + 'h and ' + habit.goal.minutes + 'm';
                } else {
                    bodyText = 'Just a reminder that you have ' + remainingHours + 'h left to complete today out of ' + habit.goal.hours + 'h';
                }
            } else {
                bodyText = 'Just a reminder that you have ' + remainingMinutes + 'm left to complete today out of ' + habit.goal.minutes + 'm';
            }
        } else {
            if (habit.goal.hours > 0) {
                if (habit.goal.minutes > 0) {
                    bodyText = 'Just a reminder that you have ' + habit.goal.hours + 'h and ' + habit.goal.minutes + 'm left to complete today';
                } else {
                    bodyText = 'Just a reminder that you have ' + habit.goal.hours + 'h left to complete today';
                }
            } else {
                bodyText = 'Just a reminder that you have ' + habit.goal.minutes + 'm left to complete today';
            }
        }
        
    } else if (habit.goal.type === 'Checklist') {
        let numCompleted = 0;
        if (partial != null) {
            for (let i = 0; i < partial.length; i++) {
                if (partial[i] === true) { numCompleted++; }
            }
            let remainder = habit.goal.subtasks.length - numCompleted;
            bodyText = 'Just a reminder that you have ' + remainder + ' subtasks left to complete today out of ' + habit.goal.subtasks.length;
        } else {
            bodyText = 'Just a reminder that you have ' + habit.goal.subtasks.length + ' subtasks left to complete today';
        }
    }

    let hours = parseInt(habit.notifications.time.split(':')[0]);
    let minutes = parseInt(habit.notifications.time.split(':')[1]);

    if (Platform.OS === 'ios') {
        Notifications.scheduleNotificationAsync({
            identifier: id,
            content: {
                title: habit.name,
                body: bodyText
            },
            trigger: {
                hour: hours,
                minute: minutes
            }
        });

    } else if (Platform.OS === 'android') {
        let trigger = new Date();
        trigger.setHours(hours, minutes, 0, 0);

        Notifications.scheduleNotificationAsync({
            identifier: id,
            content: {
                title: habit.name,
                body: bodyText
            },
            trigger
        });
    }

    return;
};

const cancelNotification = (id) => {
    Notifications.cancelScheduledNotificationAsync(id);
};

export { displayHabitNotification, cancelNotification };