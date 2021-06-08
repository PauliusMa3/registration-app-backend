const {isValidReservationDate} = require('../utils/date');

async function validateRequiredReservationFields(req,res, next) {
    if( req.body && (req.body.firstName && req.body.lastName && isValidReservationDate(req.body.reservationDate))) {
        next();
    } else {
        res.status(400).json({
            message: "Missing or Invalid fields provided for reservation"
        })
    }
}

module.exports = {
    validateRequiredReservationFields
}
