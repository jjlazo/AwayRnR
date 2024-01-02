import { useDispatch, useSelector } from "react-redux";
import { fetchDeleteReview, fetchReviews } from "../../store/reviews";
import { useEffect } from "react";
import ReviewForm from "./ReviewForm";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import "./ReviewList.css";
import { useModal } from "../../context/Modal";

export const formatDate = (date = new Date()) => {
    let month = date.getMonth();
    let year = date.getFullYear();

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    return `${months[month]} ${year}`;
}

const ReviewList = ({ spot }) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const reviewObj = useSelector(state => state.reviews[spot.id]);
    const sessionObj = useSelector(state => state.session);

    const reviews = reviewObj ? Object.values(reviewObj) : [];


    useEffect(() => {
        dispatch(fetchReviews(spot.id));
    }, [dispatch, spot.id]);

    let userIsOwner = sessionObj.user && sessionObj.user.id === spot.ownerId
    let showReviewMessage = reviews.length === 0 && !userIsOwner;
    const userHasReviewed = reviews.some(review => review.userId === sessionObj.user.id);

    const handleDeleteReview = review => {
        dispatch(fetchDeleteReview(spot.id, review));
        closeModal();
    }

    // if there are no reviews & user is not owner show
    if (showReviewMessage) {
        return <div id="review-list">
            {
                (sessionObj.user && !userIsOwner && !userHasReviewed) &&
                <div id="post-review-button">
                    <OpenModalMenuItem
                        itemText="Post Your Review!"
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
                        modalComponent={<ReviewForm spot={spot} />}
                    />
                </div>
            }
            <ul>
                {reviews.sort((s1, s2) => new Date(s2.createdAt) - new Date(s1.createdAt)).map((review = {}) => <li key={review.id}>
                    <div>
                        <div>{review.User.firstName}</div>
                        <div>{formatDate(new Date(review.createdAt))}</div>
                        <div>{review.review}</div>
                        {review.userId === sessionObj.user.id && (
                            // <button type='button' onClick={}>Delete</button>
                                <OpenModalMenuItem
                                    itemText="Delete"
                                    modalComponent={(
                                        <div id="confirm-delete-modal">
                                            <h2>Confirm Delete</h2>
                                            <span>Are you sure you want to remove this spot from the listings?</span>
                                            <button id='confirm-delete-button' type='button' onClick={() => handleDeleteReview(review)}>Yes (Delete Review)</button>
                                            <button id='confirm-delete-cancel' type='button' onClick={closeModal}>No (Keep Review)</button>
                                        </div>
                                    )}
                                />
                        )}
                    </div>
                </li>)}
            </ul>
        </div>
    )
}

export default ReviewList;
