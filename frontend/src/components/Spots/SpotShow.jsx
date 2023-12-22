// import { Link, useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchSingleSpot } from '../../store/spots.js';

// const SpotShow = () => {
//   const dispatch = useDispatch()
//   const { spotId } = useParams();
//   // const navigate = useNavigate();
//   // const [goToSpot, setGoToSpot] = useState(spotId);
//   const spotObj = useSelector(state => state.spots);
//   const spot = spotObj[spotId]

//   useEffect(() => {
//     dispatch(fetchSingleSpot(spotId))
//   }, [dispatch, spotId])

//   // const handleSubmit = e => {
//   //   e.preventDefault();
//   //   navigate(`/spots/${goToSpot}`);
//   // }

//   return (
//     <>
//     <h2>{spot.name}</h2>
//     <h3>{spot.city}, {spot.state}, {spot.country}</h3>
//     <div id="spot-img-div">
//     {spot.SpotImages.map((image) => <img src={image.url} key={image.id} className='spot-images' />)}
//     </div>
//     </>
//   );
// };

// export default SpotShow;
