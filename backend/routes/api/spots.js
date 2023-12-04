const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models')
//get all spots
router.get('/', async (req, res) => {
    const Spots = await Spot.findAll({
        include: [
            { model: Review, attributes: ['stars'] },
            { model: SpotImage, attributes: ['url', 'preview'] }
        ]
    });
    //loop through spots
    const spots = []
    Spots.forEach(s => {
        const spot = s.toJSON();
        // spot.Reviews //reduce stars
        const totalStars = spot.Reviews.reduce((total, review) => {
            return total += review.stars
        }, 0);
        // console.log({ totalStars })
        const totalReviews = spot.Reviews.reduce((acc, review) => { return acc += 1 }, 0);

        // spot.SpotImage // loop through and check if preview is true,
        // if false "no prev img available err"
        const previewImage = spot.SpotImages.find(image => image.preview === true);
        const previewImageUrl = previewImage ? previewImage.url : 'No preview image available';
        // console.log({ previewImage });
        // console.log({ previewImageUrl });

        const starRating = totalStars / totalReviews;
        spot.avgRating = starRating || 'No rating available';
        spot.previewImage = previewImageUrl;

        // console.log({ starRating });
        delete spot.Reviews;
        delete spot.SpotImages;
        spots.push(spot);
    });

    return res.json(spots);
});
// get current user spots
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const userSpots = await Spot.findAll({
            where: {
                ownerId: user.id
            },
            include: [
                { model: Review, attributes: ['stars'] },
                { model: SpotImage, attributes: ['url', 'preview'] }
            ]
        });
        const spots = []
        userSpots.forEach(s => {
            const spot = s.toJSON();
            const totalStars = spot.Reviews.reduce((total, review) => {
                return total += review.stars
            }, 0);
            const totalReviews = spot.Reviews.reduce((acc, review) => { return acc += 1 }, 0);
            const previewImage = spot.SpotImages.find(image => image.preview === true);
            const previewImageUrl = previewImage ? previewImage.url : 'No preview image available';

            const starRating = totalStars / totalReviews;
            spot.avgRating = starRating;
            spot.previewImage = previewImageUrl;

            delete spot.Reviews;
            delete spot.SpotImages;
            spots.push(spot);
        });

        res.json(spots);
    }
);
//get spot by id
router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const spotById = await Spot.findOne({
        where: {
            id: spotId
        },
        include: [
            { model: SpotImage },
            { model: Review, attributes: ['stars'] },
            { model: User, attributes: ['id', 'firstName', 'lastName'] }
        ],
    });

    // console.log({ spotById });
    if (!spotById) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    };

    const payload = spotById.toJSON();
    const totalStars = payload.Reviews.reduce((total, review) => {
        return total += review.stars
    }, 0);
    const totalReviews = payload.Reviews.reduce((acc, review) => { return acc += 1 }, 0);

    const starRating = totalStars / totalReviews;
    payload.avgRating = starRating || 'No rating available';
    payload.Owner = payload.User;

    delete payload.User;
    delete payload.Reviews;

    res.json(payload);
})

// create a spot route
// import authentication middleware
// body validation err handling
const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a name'),
    check('name')
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

router.post(
    '/',
    requireAuth,
    validateSpot,
    async (req, res) => {
        const { user } = req;
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({
            ownerId: user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        return res.json(newSpot);

    }
);

const requireOwner = async function (req, res, next) {
    const { user } = req;
    const { spotId } = req.params;
    const currentSpot = await Spot.findOne({
        where: {
            id: spotId,
        }
    });
    if (!currentSpot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
    if (currentSpot.ownerId !== user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
};

const validateSpotImage = [
    check('preview')
        .exists({ checkNull: true })
        .withMessage("Please provide a preview option"),
    check('url')
        .exists({ checkFalsy: true })
        .withMessage("Please provide an image url"),
    handleValidationErrors
];

// add image based on id
router.post(
    '/:spotId/images',
    requireAuth,
    requireOwner,
    validateSpotImage,
    async (req, res) => {
        const { spotId } = req.params;
        const { preview, url } = req.body;

        const newSpotImage = await SpotImage.create({
            spotId: spotId,
            preview,
            url
        });

        return res.json({
            id: newSpotImage.id,
            preview: newSpotImage.preview,
            url: newSpotImage.url
        })
    }
);
// update a spot
router.put(
    '/:spotId',
    requireAuth,
    requireOwner,
    validateSpot,
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const { spotId } = req.params;
        const currentSpot = await Spot.findOne({
            where: {
                id: spotId,
            }
        });

        currentSpot.address = address || currentSpot.address;
        currentSpot.city = city || currentSpot.city;
        currentSpot.state = state || currentSpot.state;
        currentSpot.country = country || currentSpot.country;
        currentSpot.lat = lat || currentSpot.lat;
        currentSpot.lng = lng || currentSpot.lng;
        currentSpot.name = name || currentSpot.name;
        currentSpot.description = description || currentSpot.description;
        currentSpot.price = price || currentSpot.price;

        await currentSpot.save();

        return res.json(currentSpot);
    }
);

// delete a spot
router.delete(
    '/:spotId',
    requireAuth,
    requireOwner,
    async (req, res) => {
        const { spotId } = req.params;
        const currentSpot = await Spot.findOne({
            where: {
                id: spotId,
            }
        });

        await currentSpot.destroy();

        return res.json({ message: "Successfully deleted" });
    }
);
const spotFinder = async (req, res, next) => {
    const { spotId } = req.params;
    const currentSpot = await Spot.findOne({
        where: {
            id: spotId,
        }
    });
    if (!currentSpot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
    return next();
};

//get all bookings for a spot
// res should only include { spotId, startDate, endDate } if not the owner of the spot
// res includes User model, { userId, id, spotId, startdate, enddate, createdAt, updatedAt } if owner of spot
router.get(
    "/:spotId/bookings",
    requireAuth,
    spotFinder,
    async (req, res) => {
        const { spotId } = req.params;
        const { user } = req;

        const spotBookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
        });

        const currSpot = await Spot.findOne({
            where: {
                id: spotId
            },
            attributes: ['id']
        });

        const userBooking = await Booking.findOne({
            where: {
                spotId: spotId
            }
        });

        if (currSpot.ownerId !== user.id && userBooking) {
            return res.json({
                spotId,
                startDate: userBooking.startDate,
                endDate: userBooking.endDate
            });
        };
        if (currSpot.ownerId === user.id) {
            return res.json(spotBookings);
        };
    }
);

const nonOwner = async (req, res, next) => {
    const { spotId } = req.params;
    const { user } = req;
    const currentSpot = await Spot.findOne({
        where: {
            id: spotId,
        }
    });
    if (currentSpot.ownerId === user.id) {
        return res.status(403).json({ message: "Spot must not belong to the current user" });
    }
    return next();
};

const badDates = async (req, res, next) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;

    const bookingsAtSpot = await Booking.findAll({
        where: {
            spotId: spotId
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


//create a booking for a spot based on the spots id
router.post(
    '/:spotId/bookings',
    spotFinder,
    requireAuth,
    nonOwner,
    badDates,
    async (req, res) => {
        const { startDate, endDate } = req.body;
        const { user } = req;
        const { spotId } = req.params;

        const newBooking = await Booking.create({
            startDate,
            endDate,
            userId: user.id,
            spotId: spotId
        });

        return res.json(newBooking);
    }
);

//get reviews by spot id
router.get(
    '/:spotId/reviews',
    spotFinder,
    async (req, res) => {
        const { spotId } = req.params;

        const spotReviews = await Review.findAll({
            where: {
                spotId: spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        return res.json(spotReviews);
    }
);

const uniqueReview = async function (req, res, next) {
    const { user } = req;
    const { spotId } = req.params;

    const oldie = await Review.findOne({
        where: {
            userId: user.id,
            spotId: spotId
        }
    });

    if (oldie) {
        return res.status(500).json({ message: "User already has a review for this spot" });
    };

    return next();
};

const reviewValidator = [
    check('review')
        .exists({ checkNull: true })
        .withMessage("Review text is required"),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

//create a review based on spot id
router.post(
    '/:spotId/reviews',
    requireAuth,
    spotFinder,
    uniqueReview,
    reviewValidator,
    async (req, res) => {
        const { user } = req;
        const { spotId } = req.params;
        const { review, stars } = req.body;

        const newReview = await Review.create({
            spotId: parseInt(spotId, 10),
            userId: user.id,
            review,
            stars
        });

        await newReview.save();

        return res.json(newReview);
    }
);

module.exports = router;
