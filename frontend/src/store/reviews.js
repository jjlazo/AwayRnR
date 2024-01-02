import { csrfFetch } from "./csrf";
import { addReview } from "./spots";

//types
const READ_REVIEWS = "reviews/readReviews";
const CREATE_REVIEW = "reviews/createReview";
export const REMOVE_REVIEW = "reviews/removeReview";
//actions
export const readReviews = (spotId, reviews) => ({
    type: READ_REVIEWS,
    reviews,
    spotId
});

export const removeReview = (spotId, review) => ({
    type: REMOVE_REVIEW,
    review,
    spotId
});

export const createReview = (spotId, review) => ({
    type: CREATE_REVIEW,
    review,
    spotId,
});

//thunk
export const fetchReviews = spotId => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();
    const reviews = data;

    dispatch(readReviews(spotId, reviews));

    return { reviews }
};

export const fetchCreateReview = (spotId, review) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
      });
    const newReview = await res.json();

    dispatch(createReview(spotId, newReview));

    dispatch(addReview(spotId, review.stars));

    return { review: newReview }
};

// export const fetchUpdateReview = (spotId, review) => async (dispatch) => {
//     const res = await csrfFetch(`/api/reviews/${review.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(review)
//       });

//     const updatedReview = await res.json();

//     dispatch(createReview(updatedReview));

//     return { review: updatedReview }
// };

export const fetchDeleteReview = (spotId, review) => async (dispatch) => {
    await csrfFetch(`/api/reviews/${review.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reviewId: review.id })
      });

    dispatch(removeReview(spotId, review));

    return true;
};


//reducer
/**
 * {
 *   [spotId]: {...spotReviews}
 * }
 */

const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case READ_REVIEWS: {
            const newState = { ...(state[action.spotId] || {}) };
            for (let review of action.reviews) {
                newState[review.id] = review;
            }
            return { ...state, [action.spotId]: newState};
        }
        case REMOVE_REVIEW: {
            const newState = { ...(state[action.spotId] || {}) };
            delete newState[action.review.id];
            return { ...state, [action.spotId]: newState};
        }
        case CREATE_REVIEW: {
            const newState = { ...(state[action.spotId] || {}) };
            newState[action.review.id] = action.review;
            return { ...state, [action.spotId]: newState };
        }
        default:
            return state;
    }
};

export default reviewsReducer;
