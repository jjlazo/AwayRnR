const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Review, User, ReviewImage, Booking, SpotImage } = require('../../db/models');

const requireOwner = async function (req, res, next) {
    const { user } = req;
    const { imageId } = req.params;

    const image = await ReviewImage.findOne({
        where: {
            id: imageId
        }
    })

    const review = await Review.findOne({
        where: {
            id: image.reviewId
        }
    })

    if (review.userId !== user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
};

const reviewImageFinder = async (req, res, next) => {
    const { imageId } = req.params;

    const image = await ReviewImage.findOne({
        where: {
            id: imageId
        }
    })

    if (!image) {
        return res.status(404).json({ message: "Review Image couldn't be found" });
    }
    next()
}

router.delete(
    '/:imageId',
    requireAuth,
    reviewImageFinder,
    requireOwner,
    async (req, res) => {
        const { imageId } = req.params;

        const image = await ReviewImage.findOne({
            where: {
                id: imageId
            }
        })

        if (image) {
            await image.destroy()

            res.json({ "message": "Successfully deleted" })
        }

    }
)

module.exports = router;
