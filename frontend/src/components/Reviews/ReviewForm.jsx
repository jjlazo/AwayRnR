import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchCreateReview } from "../../store/reviews";
import StarsInput from "./StarsInput";

import "./ReviewForm.css";

const ReviewForm = ({ spot }) => {
    const dispatch = useDispatch();
    const [reviewText, setReview] = useState("");
    const [stars, setStars] = useState(null);
    const [errors, setErrors] = useState("");
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors("");
        const review = {
            review: reviewText,
            stars
        };
        return dispatch(fetchCreateReview(spot.id, review))
            .then(closeModal)
            .catch(async (res) => {
                debugger
                const data = await res.json();
                if (data && data.message) {
                    setErrors(data.message);
                }
            });
    };

    const disabled = reviewText.length < 10 || stars === null;

    console.log({errors})
    return (
        <form onSubmit={handleSubmit} id='review-form'>
            <h2>How was your stay?</h2>
            <textarea
                placeholder="Leave your review here..."
                value={reviewText}
                onChange={(e) => setReview(e.target.value)}
                required
                id="review-form-text-area"
            />
            {errors && (<p>{errors}</p>)}
            <StarsInput setStars={setStars} stars={stars} />
            <button
                type='submit'
                disabled={disabled}
                onClick={handleSubmit}
            >
                Submit Your Review
            </button>
        </form>
    )
}


export default ReviewForm;
