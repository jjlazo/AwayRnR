import { useState } from "react";

const StarsInput = ({ stars, setStars }) => {
    const [visibleStars, setVisibleStars] = useState(0);
    return (
        <>
            <div className="stars-input">
                <div
                    onClick={() => { setVisibleStars(1); setStars(1) }}
                    onMouseEnter={() => setVisibleStars(1)}
                    onMouseLeave={() => setVisibleStars(stars)}>
                    <i className={`${visibleStars >= 1 ? "fas" : "far"} fa-star`}></i>
                </div>
                <div
                    onClick={() => { setVisibleStars(2); setStars(2) }}
                    onMouseEnter={() => setVisibleStars(2)}
                    onMouseLeave={() => setVisibleStars(stars)}>
                    <i className={`${visibleStars >= 2 ? "fas" : "far"} fa-star`}></i>
                </div>
                <div
                    onClick={() => { setVisibleStars(3); setStars(3) }}
                    onMouseEnter={() => setVisibleStars(3)}
                    onMouseLeave={() => setVisibleStars(stars)}>
                    <i className={`${visibleStars >= 3 ? "fas" : "far"} fa-star`}></i>
                </div>
                <div
                    onClick={() => { setVisibleStars(4); setStars(4) }}
                    onMouseEnter={() => setVisibleStars(4)}
                    onMouseLeave={() => setVisibleStars(stars)}>
                    <i className={`${visibleStars >= 4 ? "fas" : "far"} fa-star`}></i>
                </div>
                <div
                    onClick={() => { setVisibleStars(5); setStars(5) }}
                    onMouseEnter={() => setVisibleStars(5)}
                    onMouseLeave={() => setVisibleStars(stars)}>
                    <i className={`${visibleStars === 5 ? "fas" : "far"} fa-star`}></i>
                </div>
            </div>
        </>
    );

}

export default StarsInput;
