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
                setErrors("We have encountered an error, please try again later");
            });
    };

    const disabled = reviewText.length < 10 || stars === null;

    return (
        <form onSubmit={handleSubmit} id='review-form'>
            <h2>How was your stay?</h2>
            {errors && (<p>{errors}</p>)}
            <textarea
                placeholder="Leave your review here..."
                value={reviewText}
                onChange={(e) => setReview(e.target.value)}
                required
                id="review-form-text-area"
            />
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
