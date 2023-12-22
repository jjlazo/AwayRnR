import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { useEffect } from 'react';
import "./SpotsIndex.css"

const SpotsIndex = () => {
    const dispatch = useDispatch()
    const spotsObj = useSelector(state => state.spots);
    const spots = Object.values(spotsObj)

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);
    //TODO
    return (
        <section id='spot-section'>
            <ul id='spots'>
                {spots.map((spot) => (
                    <div
                        id='spot-card'
                        key={spot.id}>
                        <img
                            src={spot.previewImage}
                            id='spot-img' />
                        <div id='spot-deets'>
                            <p>{spot.city}, {spot.state}</p>
                            {/* TODO: avg rating */}
                            <p>{spot.avgRating}</p>
                        </div>
                        <p id='spot-price'>${spot.price} night</p>
                    </div>
                ))}
            </ul>
        </section>
    );
};

export default SpotsIndex;
