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
    // const reviews = {};
    // for (let spot of spots) {
    //     if ('Reviews' in spot) {
    //         for (let review of spot.Reviews) {
    //             reviews[review.id] = review;
    //         }
    //         delete spot.Reviews;
    //     }
    // }
    dispatch(readSpots(spots));
    // dispatch(receiveReviews(reviews));
    // return { spots, reviews };
    return { spots }
};

export const fetchSingleSpot = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`);
    const data = await res.json();
    const spot = data;

    dispatch(readSpot(spot));

    return { spot }
};

// const selectSpots = state => state?.spots;

// export const selectAllSpots = createSelector(selectSpots, spots => {
//     return spots ? Object.values(spots) : [];
// });

// export const selectSpot = spotId => state => {
//     return state?.spots ? state.spots[spotId] : null;
// };

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
            return { ...state, spots: [action.spot, ...state.spots] };
        default:
            return state;
    }
};

export default spotsReducer;
