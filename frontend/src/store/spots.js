import { csrfFetch } from "./csrf";
import { REMOVE_REVIEW } from "./reviews";

//types
const READ_SPOTS = "spots/readSpots";
const READ_SPOT = "spots/readSpot";
const CREATE_SPOT = "spots/createSpot";
const UPDATE_SPOT = "spots/updateSpot";
const ADD_REVIEW = "spots/addReview";
const REMOVE_SPOT = "spots/removeSpot";
//actions
export const readSpots = spots => ({
    type: READ_SPOTS,
    spots
});

export const readSpot = spot => ({
    type: READ_SPOT,
    spot
});

export const removeSpot = spotId => ({
    type: REMOVE_SPOT,
    spotId
});

export const updateSpot = spotId => ({
    type: UPDATE_SPOT,
    spotId
});

export const addReview = (spotId, stars) => ({
    type: ADD_REVIEW,
    spotId,
    stars
});

export const createSpot = spot => ({
    type: CREATE_SPOT,
    spot
});

//thunk
export const fetchSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');
    const data = await res.json();
    const spots = data;

    dispatch(readSpots(spots));

    return { spots }
};

export const fetchCreateSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    });

    const newSpot = await res.json();

    if (spot.images[0]) {
        const imageRes0 = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ preview: true, url: spot.images[0] })
        });
    }

    if (spot.images[1]) {
        const imageRes1 = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ preview: true, url: spot.images[1] })
        });
    }

    if (spot.images[2]) {
        const imageRes2 = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ preview: true, url: spot.images[2] })
        });
    }

    if (spot.images[3]) {
        const imageRes3 = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ preview: true, url: spot.images[3] })
        });
    }

    if (spot.images[4]) {
        const imageRes4 = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ preview: true, url: spot.images[4] })
        });
    }

    dispatch(createSpot(newSpot));

    return { spot: newSpot }
};

export const fetchUpdateSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    });

    const updatedSpot = await res.json();

    dispatch(createSpot(updatedSpot));

    return { spot: updatedSpot }
};

export const fetchDeleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    dispatch(removeSpot(spotId));

    return true;
};

export const fetchSingleSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    const data = await res.json();
    const spot = data;

    dispatch(readSpot(spot));

    return { spot }
};

//reducer
const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_REVIEW: {
            const numReviews = state[action.spotId].numReviews + 1;
            let avgRating = action.stars;
            if (numReviews > 1) {
                const totalRating = state[action.spotId].numReviews * state[action.spotId].avgRating;
                avgRating = ((totalRating + action.stars) / numReviews).toFixed(1);
            }
            return { ...state, [action.spotId]: {...state[action.spotId], numReviews, avgRating}}
        }
        case REMOVE_REVIEW: {
            const numReviews = state[action.spotId].numReviews - 1;

            let avgRating = 'New';
            if (numReviews !== 0) {
                const totalRating = state[action.spotId].numReviews * state[action.spotId].avgRating;
                avgRating = ((totalRating - action.review.stars) / numReviews).toFixed(1);
            }

            return { ...state, [action.spotId]: {...state[action.spotId], numReviews, avgRating}}
        }
        case READ_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        case READ_SPOTS: {
            const newState = { ...state };
            for (let spot of action.spots) {
                newState[spot.id] = spot;
            }
            return newState;
        }
        case REMOVE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }
        case CREATE_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        case UPDATE_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        default:
            return state;
    }
};

export default spotsReducer;
