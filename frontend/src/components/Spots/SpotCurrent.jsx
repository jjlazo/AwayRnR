import { useSelector, useDispatch } from 'react-redux';
import { fetchDeleteSpot, fetchSpots } from '../../store/spots';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SpotCurrent.css"
import "./SpotsIndex.css"
import { useModal } from '../../context/Modal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

const SpotCurrent = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { closeModal } = useModal();

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    const userId = useSelector(state => state.session.user ? state.session.user.id : null);
    const spots = useSelector(state => Object.values(state.spots).filter(spot => spot.ownerId === userId));

    if (!userId) navigate('/');

    const handleUpdate = spotId => {
        navigate(`/spots/${spotId}/edit`);
    };

    const handleDelete = spotId => {
        dispatch(fetchDeleteSpot(spotId));
        closeModal();
    };

    return (
        <div id='current-spot-section'>
            <h1>Manage Your Spots</h1>
            <button type="button" onClick={() => navigate("/spots/new")}>Create a New Spot</button>
            <br />
            <ul id='spots'>
                {spots.map((spot) => (
                    <div>
                        <div
                            className='spot-card'
                            title={spot.name}
                            onClick={() => navigate(`/spots/${spot.id}`)}
                            key={spot.id}>
                            <img
                                src={spot.previewImage}
                                className='spot-img' />
                            <div className='spot-deets'>
                                <p>{spot.city}, {spot.state}</p>
                                <p>★{spot.avgRating}</p>
                            </div>
                            <p className='spot-price'>${spot.price} night</p>
                        </div>
                        <div className='management-row'>
                            <button type='button' onClick={() => handleUpdate(spot.id)}>Update</button>
                            <OpenModalMenuItem
                                itemText="Delete"
                                modalComponent={(
                                    <div id="confirm-delete-modal">
                                        <h2>Confirm Delete</h2>
                                        <span>Are you sure you want to remove this spot from the listings?</span>
                                        <button id='confirm-delete-button' type='button' onClick={() => handleDelete(spot.id)}>Yes (Delete Spot)</button>
                                        <button id='confirm-delete-cancel' type='button' onClick={closeModal}>No (Keep Spot)</button>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default SpotCurrent;
