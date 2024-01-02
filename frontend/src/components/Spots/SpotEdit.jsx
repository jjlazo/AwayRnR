import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUpdateSpot } from '../../store/spots';
// import "./SpotEdit.css"
// import "./SpotsIndex.css"

const SpotEdit = () => {
  const { spotId } = useParams();
  const currentSpot = useSelector(state => state.spots[spotId]);


  const [country, setCountry] = useState(currentSpot.country || "");
  const [address, setAddress] = useState(currentSpot.address || "");
  const [city, setCity] = useState(currentSpot.city || "");
  const [state, setState] = useState(currentSpot.state || "");
  const [description, setDescription] = useState(currentSpot.description || "");
  const [title, setTitle] = useState(currentSpot.name || "");
  const [price, setPrice] = useState(currentSpot.price || 0);
  const [images, setImages] = useState(Object.assign({}, [currentSpot.previewImage]) || { 0: "", 1: "", 2: "", 3: "", 4: "" });
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    const spot = {
      id: currentSpot.id, address, city, state, country, lat: 1, lng: 1, name: title, description, price, images: Object.values(images)
    };
    dispatch(fetchUpdateSpot(spot))
      .then(({ spot: newSpot }) => navigate(`/spots/${newSpot.id}`))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });

  }

  const submitDisabled = false;
  // const submitDisabled = description.length < 30;

  return (
    <div id="spot-new">
      <form onSubmit={handleSubmit} id='sn-form'>
        <h2>Update your Spot</h2>
        <div className="sn-form-section">
          <h3>Where's your place located?</h3>
          <p>Guests will only get your exact address once they book a reservation.</p>
          <label className='sn-label'>
            Country
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}

            />
          </label>
          {errors.country && <p>{errors.country}</p>}
          <label className='sn-label'>
            Address
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}

            />
          </label>
          {errors.address && <p>{errors.address}</p>}
          <div id="city-state-row">
            <label className='sn-label'>
              City
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}

              />
            </label>
            {errors.city && <p>{errors.city}</p>}
            <span id="city-state-comma">,</span>
            <label className='sn-label'>
              State
              <input
                type="text"
                placeholder="STATE"
                value={state}
                onChange={(e) => setState(e.target.value)}

              />
            </label>
            {errors.state && <p>{errors.state}</p>}
          </div>

        </div>
        <div className="sn-form-section">
          <label className='sn-label'>
            Describe your place to guests
            <small>Mention the best features of your space, any special amentities like
              fast wifi or parking, and what you love about the neighborhood.</small>
            <textarea
              placeholder="Please write at least 30 characters"
              value={description}
              onChange={(e) => setDescription(e.target.value)}

            />
          </label>
          {errors.description && <p>{errors.description}</p>}
        </div>

        <div className="sn-form-section">
          <label className='sn-label'>
            Create a title for your spot
            <small>
              Catch guests' attention with a spot title that highlights what makes
              your place special.
            </small>
            <input
              placeholder="Name of your spot"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}

            />
          </label>
          {errors.title && (
            <p>{errors.title}</p>
          )}
        </div>

        <div className="sn-form-section">
          <label className='sn-label'>
            Set a base price for your spot
            <small>
              Competitive pricing can help your listing stand out and rank higher
              in search results.
            </small>
            <span>
              $ <input
                placeholder="Price per night (USD)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}

              />
            </span>
          </label>
          {errors.price && (
            <p>{errors.price}</p>
          )}
        </div>

        <div id="sn-form-image-section" className="sn-form-section">
          <label className='sn-label'>
            Liven up your spot with photos
            <small>
              Submit a link to at least one photo to publish your spot.
            </small>
            <input
              placeholder="Preview Image Url"
              type="text"
              value={images[0]}
              onChange={(e) => setImages({ ...images, [0]: e.target.value })}

            />
            <input
              placeholder="Image Url"
              type="text"
              value={images[1]}
              onChange={(e) => setImages({ ...images, [1]: e.target.value })}
            />
            <input
              placeholder="Image Url"
              type="text"
              value={images[2]}
              onChange={(e) => setImages({ ...images, [2]: e.target.value })}
            />
            <input
              placeholder="Image Url"
              type="text"
              value={images[3]}
              onChange={(e) => setImages({ ...images, [3]: e.target.value })}
            />
            <input
              placeholder="Image Url"
              type="text"
              value={images[4]}
              onChange={(e) => setImages({ ...images, [4]: e.target.value })}
            />
          </label>
          {errors.price && (
            <p>{errors.price}</p>
          )}
        </div>

        <button id="sn-form-submit" disabled={submitDisabled} type="submit">Update your Spot</button>
      </form>
    </div>
  );
};

export default SpotEdit;
