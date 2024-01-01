import { useDispatch, useSelector } from "react-redux";
import { fetchCreateReview, fetchReviews } from "../../store/reviews";
import { useEffect, useMemo, useState } from "react";
import ReviewForm from "./ReviewForm";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import "./ReviewList.css";

const ReviewList = ({ spot }) => {
    const dispatch = useDispatch()
    const reviewObj = useSelector(state => state.reviews[spot.id]);
    const sessionObj = useSelector(state => state.session);

    const reviews = reviewObj ? Object.values(reviewObj) : [];

    // const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        dispatch(fetchReviews(spot.id));
    }, [dispatch, spot.id]);

    let userIsOwner = sessionObj.user && sessionObj.user.id === spot.ownerId
    let showReviewMessage = reviews.length === 0 && !userIsOwner;
    const userHasReviewed = reviews.some(review => review.userId === sessionObj.user.id);

    // const handleClick = data => {
    //     setShowReviewForm(true);
    // }

    // if there are no reviews & user is not owner show
    if (showReviewMessage) {
        return <div id="review-list">
            {
                (sessionObj.user && !userIsOwner && !userHasReviewed) &&
                <div id="post-review-button">
                    <OpenModalMenuItem
                        itemText="Post Your Review!"
                        // onItemClick={handleClick}
                        modalComponent={<ReviewForm spot={spot} />}
                    />
                </div>
            }
            <p>Be the first to post a review!</p>
        </div>
    }

    return (
        <div id="review-list">
            {
                (sessionObj.user && !userIsOwner && !userHasReviewed) &&
                <div id="post-review-button">
                    <OpenModalMenuItem
                        itemText="Post Your Review!"
                        // onItemClick={handleClick}
                        modalComponent={<ReviewForm spot={spot} />}
                    />
                </div>
            }
            <ul>
                {reviews.sort((s1, s2) => new Date(s2.createdAt) - new Date(s1.createdAt)).map((review = {}) => <li key={review.id}>
                    <div>
                        <div>{review.User.firstName}</div>
                        <div>{review.createdAt}</div>
                        <div>{review.review}</div>
                    </div>
                </li>)}
            </ul>
        </div>
    )
}

export default ReviewList;
