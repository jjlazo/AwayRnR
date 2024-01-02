import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { useEffect } from 'react';
import "./SpotsIndex.css"
import { useNavigate } from 'react-router-dom';

const SpotsIndex = () => {
    const dispatch = useDispatch()
    const spotsObj = useSelector(state => state.spots);
    const spots = Object.values(spotsObj);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);
    return (
        <section id='spot-section'>
            <ul id='spots'>
                {spots.map((spot) => (
                    <div
                        className='spot-card'
                        title={spot.name}
                        onClick={() => navigate(`spots/${spot.id}`)}
                        key={spot.id}>
                        <div style={{height: "150px"}}>
                            <img
                                src={spot.previewImage}
                                className='spot-img' />
                        </div>
                        <div className='spot-deets'>
                            <p>{spot.city}, {spot.state}</p>
                            <p>★{spot.avgRating}</p>
                        </div>
                        <p className='spot-price'>${spot.price} night</p>
                    </div>
                ))}
            </ul>
        </section>
    );
};

export default SpotsIndex;
