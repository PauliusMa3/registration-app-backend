const  express = require('express');
const  {reservationController} = require('../controllers');
const {validateRequiredReservationFields} = require('../middlewares/reservation');

function getReservationRoutes() {
    const router = express.Router();
    router.get('/',reservationController.fetchAllReservations);
    router.post('/', validateRequiredReservationFields, reservationController.addNewReservation);
    return router;
}

module.exports = {getReservationRoutes}