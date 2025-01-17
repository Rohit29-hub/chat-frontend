
export function getTimeDifference(pastDate: string) {
    // Parse the dates if they are strings
    const pastDateTime = new Date(pastDate);
    const currentDate = new Date();
    // Calculate the difference in milliseconds
    const timeDifferenceMs = currentDate.getTime() - pastDateTime.getTime();

    // Define time constants
    const millisecondsInSecond = 1000;
    const millisecondsInMinute = millisecondsInSecond * 60;
    const millisecondsInHour = millisecondsInMinute * 60;
    const millisecondsInDay = millisecondsInHour * 24;

    // Calculate differences in various units
    const minutes = Math.floor(timeDifferenceMs / millisecondsInMinute);
    const hours = Math.floor(timeDifferenceMs / millisecondsInHour);
    const days = Math.floor(timeDifferenceMs / millisecondsInDay);

    if (days > 0) {
        return `${days >= 7 ? 'Week' : days >= 30 ? 'month' : '1 month'} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `just now`;
    }
}
