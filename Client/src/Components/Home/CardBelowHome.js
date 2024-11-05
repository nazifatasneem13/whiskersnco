import React from "react";
import HomeDarkCardLeftPic from "./images/HomeDarkCardLeftPic.jpeg";
import HomeDarkCardRightPic from "./images/HomeDarkCardRightPic.jpeg";

const CardBelowHome = () => {
  return (
    <div className="dark-grey-container">
      <div className="left-pic">
        <img src={HomeDarkCardLeftPic} alt="Playful cat" />
      </div>

      <div className="right-para">
        <p className="we-do">OUR MISSION</p>We specialize in connecting the
        perfect pet with their forever home, ensuring a seamless adoption
        process to spread joy and cultivate love.
      </div>

      <div className="right-pic">
        <img src={HomeDarkCardRightPic} alt="Happy rabbit" />
      </div>
    </div>
  );
};

export default CardBelowHome;
