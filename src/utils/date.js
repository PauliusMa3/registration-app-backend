const moment = require('moment');

const isValidReservationDate = (date) => {
    if(!date) return false;

    const isValidDate = moment(date, 'YYYY-MM-DD HH:mm', true).isValid();
    if (!isValidDate) return false;

    return moment(date).isAfter(moment());
}

module.exports = {
    isValidReservationDate
}