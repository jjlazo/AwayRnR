const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models');

//get reviews of current user
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const userReviews = await Review.findAll({
            where: {
                userId: user.id
            },
            include: [
                { model: Spot, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ],
            attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt']
        });

        userReviews.User = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName
        };

        return res.json(userReviews);
    }
);

// check if review belongs to user
const reviewAuth = async function (req, res, next) {
    const { user } = req;
    const { reviewId } = req.params;

    const currReview = await Review.findOne({
        where: {
            id: reviewId
        }
    });
    if (!currReview) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }
    if (currReview.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
    };
    return next();
};

const tooMany = async function (req, res, next) {
    const { reviewId } = req.params;

    const imgArray = await ReviewImage.findAll({
        where: {
            reviewId
        }
    });

    if (imgArray.length >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    };
    return next();
};

const validateReviewImage = [
    check('url')
        .exists({ checkFalsy: true })
        .withMessage("Please provide an image url"),
    handleValidationErrors
];
// add image to review
// "/:reviewId/images"
router.post(
    '/:reviewId/images',
    requireAuth,
    reviewAuth,
    tooMany,
    validateReviewImage,
    async (req, res) => {
        const { reviewId } = req.params;
        const { url } = req.body;

        const newRevImg = await ReviewImage.create({
            reviewId,
            url
        });

        await newRevImg.save();

        return res.json({
            id: newRevImg.id,
            url: newRevImg.url
        });
    }
);

const reviewValidator = [
    check('review')
        .exists({ checkNull: true })
        .withMessage("Review text is required"),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

// edit a review
router.put(
    '/:reviewId',
    requireAuth,
    reviewAuth,
    reviewValidator,
    async (req, res) => {
        const { review, stars } = req.body;
        const { reviewId } = req.params;

        const currReview = await Review.findOne({
            where: {
                id: reviewId
            },
            attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt']
        });

        currReview.review = review || currReview.review;
        currReview.stars = stars || currReview.stars;

        await currReview.save();

        return res.json(currReview);
    }
);

// delete a review
router.delete(
    '/:reviewId',
    requireAuth,
    reviewAuth,
    async (req, res) => {
        const { reviewId } = req.params;
        const currentReview = await Review.findOne({
            where: {
                id: reviewId,
            }
        });

        await currentReview.destroy();

        return res.json({ message: "Successfully deleted" });
    }
);


module.exports = router;
