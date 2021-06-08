const {createNewReservation, getReservations} = require('../services/reservationService');
const addNewReservation = async(req,res, next) => {

    try {
        const {firstName, lastName, reservationDate} = req.body;
        const newReservation = await createNewReservation({
            firstName, lastName, newReservationDate: reservationDate
        });
        res.status(200).json(newReservation);
    } catch(e) {
        next(e);
    }
}

const fetchAllReservations = async(req,res) => {
    try {
        const reservations = await getReservations();
        res.status(200).json(reservations);
    } catch(e) {
        next(e);
    }
}

module.exports = {
    addNewReservation,
    fetchAllReservations
}