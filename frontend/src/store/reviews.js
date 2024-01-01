import { csrfFetch } from "./csrf";

//types
const READ_REVIEWS = "reviews/readReviews";
const CREATE_REVIEW = "reviews/createReview";
const REMOVE_REVIEW = "reviews/removeReview";
//actions
export const readReviews = (spotId, reviews) => ({
    type: READ_REVIEWS,
    reviews,
    spotId
});

export const removeReview = reviewId => ({
    type: REMOVE_REVIEW,
    reviewId
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
    debugger
    // if (res.ok) {
        const newReview = await res.json();

        dispatch(createReview(spotId, newReview));

        return { review: newReview }
    // }


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

// export const fetchDeleteReview = (spotId, review) => async (dispatch) => {
//     const res = await csrfFetch(`/api/reviews/${review.id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ reviewId: review.id })
//       });

//     const updatedReview = await res.json();

//     dispatch(removeReview(spotId, updatedReview));

//     return { review: updatedReview }
// };


//reducer
/**
 * {
 *   [spotId]: {...spotReviews}
 * }
 */

const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case READ_REVIEWS: {
            debugger
            const newState = { ...(state[action.spotId] || {}) };
            for (let review of action.reviews) {
                newState[review.id] = review;
            }
            return { ...state, [action.spotId]: newState};
        }
        case REMOVE_REVIEW: {
            debugger
            const newState = { ...(state[action.spotId] || {}) };
            delete newState[action.reviewId];
            return newState;
        }
        case CREATE_REVIEW: {
            debugger
            const newState = { ...(state[action.spotId] || {}) };
            newState[action.review.id] = action.review;
            return { ...state, [action.spotId]: newState };
        }
        default:
            return state;
    }
};

export default reviewsReducer;
