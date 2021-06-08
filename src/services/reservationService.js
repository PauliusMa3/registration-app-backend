const db = require('../models');
const {Op} = require('sequelize');
const moment = require('moment');

const createNewReservation = async({firstName, lastName, newReservationDate}) => {
    const alreadyRegisteredUser = db.Reservation.findOne({
        where:
            {
                firstName,
                lastName,
                reservationDate: {
                    [Op.gte]: moment(newReservationDate).subtract(7, 'days').toDate()
                }
            }
    });

    const timeSlotBooked = db.Reservation.findOne({
        where: {
            reservationDate: {
                [Op.eq]: newReservationDate
            }
        }
    });

    const reservationChecks = await Promise.all([alreadyRegisteredUser, timeSlotBooked]);

    if (reservationChecks[0] && !reservationChecks[1]) {
        throw new Error('You already made a reservation within the last week.');
    }

    if (!reservationChecks[0] && reservationChecks[1]) {
        throw new Error('This time slot has been reserved already.');
    }

    if(reservationChecks[0] && reservationChecks[1]) {
        throw new Error('You already made a reservation or time slot is unavailable');
    }

    try {
        const newReservation = await db.Reservation.create({
            firstName,
            lastName,
            reservationDate: newReservationDate
        })
        return newReservation;
    } catch(e) {
        throw new Error("Failed to create reservation")
    }
}

const getReservations = async() => {
    try {
        const reservations = await db.Reservation.findAll();
        return reservations
    } catch(e) {
        throw new Error('Failed to get reservations');
    }
}

module.exports = {
    getReservations,
    createNewReservation,
}

