export const formatDate = (date = new Date()) => {
    let month = date.getMonth();
    let year = date.getFullYear();

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    return `${months[month]} ${year}`;
}
