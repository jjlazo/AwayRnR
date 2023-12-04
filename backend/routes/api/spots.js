const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models')

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

const queryvalidation = async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const errors = {};
    if (page < 1) {
        errors.page = 'Page must be greater than or equal to 1';
    }
    if (page > 10) {
        errors.page = 'Page must be less than or equal to 10';
    }
    if (size < 1) {
        errors.size = 'Size must be greater than or equal to 1';
    }
    if (size > 10) {
        errors.size = 'Size must be less than or equal to 10';
    }
    if (maxLat > 90 || maxLat < -90) {
        errors.maxLat = 'Maxium latitude is invalid';
    }
    if (minLat > 90 || minLat < -90) {
        errors.minLat = 'Minimum latitude is invalid';
    }
    if (maxLng > 180 || maxLng < -180) {
        errors.maxLng = 'Maxium longitude is invalid';
    }
    if (minLng > 180 || minLng < -180) {
        errors.minLng = 'Minimum longitude is invalid';
    }
    if (minPrice < 0) {
        errors.minPrice = 'Minimum price must be greater than or equal to 0';
    }
    if (maxPrice < 0) {
        errors.maxPrice = "Maximum price must be greater than or equal to 0";
    }
    if (Object.keys(errors).length) {
        const newError = new Error('Bad Request');
        newError.errors = errors;
        newError.status(400);
        next(newError);
    }
    next();
};

const queryObjFunc = async (query) => {
    const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = query;
    const queryObj = { where: {} };

    if (minLat && maxLat) {
        queryObj.where.lat = { [Op.between]: [minLat, maxLat] }
    }
    else if (minLat) {
        queryObj.where.lat = { [Op.gte]: [minLat] }
    }
    else if (maxLat) {
        queryObj.where.lat = { [Op.lte]: [maxLat] }
    }
    if (minLng && maxLng) {
        queryObj.where.lng = { [Op.between]: [minLng, maxLng] }
    }
    else if (minLng) {
        queryObj.where.lng = { [Op.gte]: [minLng] }
    }
    else if (maxLng) {
        queryObj.where.lng = { [Op.lte]: [maxLng] }
    }
    if (minPrice && maxPrice) {
        queryObj.where.price = { [Op.between]: [minPrice, maxPrice] }
    }
    else if (minPrice) {
        queryObj.where.price = { [Op.gte]: [minPrice] }
    }
    else if (maxPrice) {
        queryObj.where.price = { [Op.lte]: [maxPrice] }
    }
    return queryObj
}

//get all spots
router.get(
    '/',
    queryvalidation,
    async (req, res) => {
        let { page, size } = req.query;
        // Set defaults
        if (page === undefined) page = 1;
        if (size === undefined) size = 20;

        const pagination = {
            limit: size,
            offset: size * (page - 1)
        };

        const query = queryObjFunc(req.query);

        const Spots = await Spot.findAll({
            include: [
                { model: Review, attributes: ['stars'] },
                { model: SpotImage, attributes: ['url', 'preview'] }
            ],
            ...pagination,
            ...query
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
    payload.numReviews = totalReviews || "No reviews available"
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
        .isInt({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isInt({ min: -180, max: 180 })
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
        .isInt({ min: 0 })
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
    spotFinder,
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
    spotFinder,
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
    spotFinder,
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
    requireAuth,
    spotFinder,
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
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
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
