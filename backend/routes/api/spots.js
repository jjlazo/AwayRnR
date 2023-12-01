const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Review, SpotImage, User } = require('../../db/models')

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
        spot.avgRating = starRating;
        spot.previewImage = previewImageUrl;

        // console.log({ starRating });
        delete spot.Reviews;
        delete spot.SpotImages;
        spots.push(spot);
    });

    return res.json(spots);
});

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

    console.log({ spotById });
    const payload = spotById.toJSON();
    const totalStars = payload.Reviews.reduce((total, review) => {
        return total += review.stars
    }, 0);
    const totalReviews = payload.Reviews.reduce((acc, review) => { return acc += 1 }, 0);

    const starRating = totalStars / totalReviews;
    payload.avgRating = starRating;
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
        .withMessage('Please provide an address'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a city'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a state'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a country'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a latitude'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a longitude'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a name'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a description'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a price'),
    handleValidationErrors
];

router.post(
    '/',
    requireAuth,
    validateSpot,
    async (req, res) => {
        const { } = req.body;
    }
);

module.exports = router;
