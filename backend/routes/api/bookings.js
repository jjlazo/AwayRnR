const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Review, User, ReviewImage, Booking, SpotImage } = require('../../db/models');

//get bookings of current user
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const userBookings = await Booking.findAll({
            where: {
                userId: user.id
            },
            include: [
                {
                    model: Spot,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    include: { model: SpotImage, attributes: ['preview', 'url'] }
                },
            ],
        });
        return res.json(userBookings);
    }
);

const badDates = async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const { bookingId } = req.params;

    const userBooking = await Booking.findOne({
        where: {
            id: bookingId
        }
    });

    const spotId = userBooking.spotId;

    const bookingsAtSpot = await Booking.findAll({
        where: {
            spotId: spotId,
            id: {
                [Op.notIn]: [bookingId]
            }
        }
    });

    if (Date.parse(startDate) >= Date.parse(endDate)) {
        return res.status(400).json({ message: "endDate cannot be on or before startDate" });
    }

    for (let i = 0; i < bookingsAtSpot.length; i++) {
        const start = Date.parse(bookingsAtSpot[i].startDate)
        const end = Date.parse(bookingsAtSpot[i].endDate)
        if ((Date.parse(startDate) >= start && Date.parse(startDate) <= end) ||
            (Date.parse(endDate) >= start && Date.parse(endDate) <= end) ||
            (Date.parse(startDate) <= start && Date.parse(endDate) >= end)) {
            const newError = new Error("Sorry, this spot is already booked for the specified dates");
            newError.status = 403;
            const errors = {};
            // start date on start or in middle of booking or end
            // if start is before other booking and end is after other booking
            if (Date.parse(startDate) >= start && Date.parse(startDate) <= end) {
                errors.startDate = "Start date conflicts with an existing booking";
            }
            // end check start middle end
            if (Date.parse(endDate) >= start && Date.parse(endDate) <= end) {
                errors.endDate = "End date conflicts with an existing booking";
            }

            if (Date.parse(startDate) <= start && Date.parse(endDate) >= end) {
                errors.startDate = "Start date conflicts with an existing booking";
                errors.endDate = "End date conflicts with an existing booking";
            }
            newError.errors = errors;
            return next(newError)
        }
    }
    return next();
};

const bookingAuth = async (req, res, next) => {
    const { user } = req;
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
        where: {
            id: bookingId
        }
    })

    if (booking.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};

const bookingFinder = async (req, res, next) => {
    const { bookingId } = req.params

    const currentBooking = await Booking.findOne({
        where: {
            id: bookingId
        }
    })

    if (!currentBooking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    }
    next()
}

// edit a booking
router.put(
    '/:bookingId',
    requireAuth,
    bookingFinder,
    bookingAuth,
    badDates,
    async (req, res) => {
        const { user } = req;
        const { bookingId } = req.params;
        const { startDate, endDate } = req.body;

        const currBooking = await Booking.findOne({
            where: {
                id: bookingId,
                userId: user.id
            }
        });

        if (Date.parse(currBooking.endDate) <= Date.now()) {
            return res.status(403).json({ message: "Past bookings can't be modified" });
        };

        currBooking.startDate = startDate;
        currBooking.endDate = endDate;

        await currBooking.save();

        return res.json(currBooking)

    }
);

// delete a booking
router.delete(
    '/:bookingId',
    requireAuth,
    bookingFinder,
    async (req, res) => {
        const { bookingId } = req.params;
        const { user } = req;

        const currentBooking = await Booking.findOne({
            where: {
                id: bookingId
            }
        })

        const spotId = currentBooking.spotId;

        const currSpot = await Spot.findOne({
            where: {
                id: spotId
            }
        })

        if (currSpot.ownerId !== user.id && currentBooking.userId !== user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (Date.parse(currentBooking.startDate) <= Date.now()) {
            return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
        }
        if (currSpot.ownerId === user.id || currentBooking.userId === user.id) {
            await currentBooking.destroy()
            return res.json({ message: "Successfully deleted" });
        }
    }
)

module.exports = router;
