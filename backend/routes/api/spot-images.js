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

    const image = await SpotImage.findOne({
        where: {
            id: imageId
        }
    })

    const spotId = image.spotId;

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

const spotImageFinder = async (req, res, next) => {
    const { imageId } = req.params;

    const image = await SpotImage.findOne({
        where: {
            id: imageId
        }
    })

    if (!image) {
        return res.status(404).json({ message: "Spot Image couldn't be found" });
    }
    next()
}

router.delete(
    '/:imageId',
    requireAuth,
    spotImageFinder,
    requireOwner,
    async (req, res) => {
        const { imageId } = req.params;

        const image = await SpotImage.findOne({
            where: {
                id: imageId
            }
        })

        await image.destroy()

        return res.json({ "message": "Successfully deleted" })
    }
)

module.exports = router;
