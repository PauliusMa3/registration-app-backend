const express = require('express');
const {getReservationRoutes} = require('./reservation');

function getRoutes() {
    const router = express.Router();
    router.use('/reservations', getReservationRoutes());
    return router;
}
module.exports = {getRoutes};