import moment from 'moment';

export const formatByInitialTime = (timestamp) => {

    const now = moment();
    const messageTime = moment(timestamp);
    const diffInDays = now.diff(messageTime, "days");

    // If the message is from today, show just the time
    if (diffInDays === 0) {
        return messageTime.format("h:mm A");
    }

    // If the message is from within the last 7 days, show the day of the week and time
    if (diffInDays < 7) {
        return messageTime.format("ddd h:mm A");
    }

    // Otherwise, show the full date and time
    return messageTime.format("MMM D, YYYY h:mm A");
}