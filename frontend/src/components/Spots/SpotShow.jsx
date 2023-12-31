import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleSpot } from '../../store/spots.js';
import "./SpotShow.css";

const SpotShow = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spotObj = useSelector(state => state.spots);
    const spot = spotObj[spotId]

    useEffect(() => {
        dispatch(fetchSingleSpot(spotId))
    }, [dispatch, spotId])

    if (!spot || !spot.SpotImages) return null;

    // todo: remove me
    spot.SpotImages = new Array(5).fill(spot.SpotImages[0]);

    return (
        <div id='spot-show'>
            <div id='spot-show-header'>
                <h2>{spot.name}</h2>
                <h3>{spot.city}, {spot.state}, {spot.country}</h3>
            </div>
            <div id='spot-show-image-section'>
                {spot.SpotImages.map((image, n) =>
                    <img src={image.url} key={image.id} className={`spot-image-${n}`} />
                )}
            </div>
            <div id='spot-show-desc-section'>
                <div id='spot-show-desc'>
                    <h3>Hosted by: {spot.Owner.firstName} {spot.Owner.lastName}</h3>
                    <p>{spot.description}</p>
                </div>

                <div id='spot-show-callout'>
                    <div id="callout-price-reviews">
                        <p>${spot.price.toFixed(2)} night</p>
                        <ReviewSummary numReviews={spot.numReviews} avgRating={spot.avgRating} />
                    </div>
                    <button onClick={() => alert("Feature coming soon")}>Reserve</button>
                </div>

            </div>
            <ReviewSummary numReviews={spot.numReviews} avgRating={spot.avgRating} />
        </div>
    )
};

const ReviewSummary = ({ numReviews, avgRating }) => {
    let suffix = numReviews === 1 ? "" : "s";
    return <p>★{avgRating} {numReviews !== 0 ? ` · ${numReviews} review${suffix}` : null}</p>;
}


export default SpotShow;
