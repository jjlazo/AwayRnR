const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { Spot, Review, SpotImage } = require('../../db/models')

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
        const totalReviews = spot.Reviews.reduce((acc, review) => { return acc += 1}, 0);

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
})

module.exports = router;
