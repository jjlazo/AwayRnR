import { csrfFetch } from "./csrf";

//types
const READ_SPOTS = "spots/readSpots";
const READ_SPOT = "spots/readSpot";
const CREATE_SPOT = "spots/createSpot";
const UPDATE_SPOT = "spots/updateSpot";
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

export const createSpot = () => ({
    type: CREATE_SPOT
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
