import React, { useState } from "react";
import girlHoldingADog from "./images/girlHoldingADog.jpg";
import homepageDog from "./images/homepageDog.jpeg";
import footPrint from "./images/footPrint.png";
import MessageModal from "../MessageModal/MessageModal";
import { useNavigate } from "react-router-dom";

const HomeLandingContainer = (props) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleAdoptClick = () => {
    if (currentUser) {
      navigate("/pets");
      scrollToTop();
    } else {
      setIsModalOpen(true); // Open modal if user is not logged in
    }
  };

  const closeModal = () => {
    navigate("/login");
    setIsModalOpen(false);
  };
  const close = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="home-container">
      <div className="homeContainer-left">
        <div>
          <div className="home-title">
            <div className="home-titlePlusPng">
              <span>Your Pets</span>
              <img src={homepageDog} alt="Dog sitting" />
            </div>
            Are Always
            <br />
            Our Top Priority
          </div>
          <p className="home-second-para">{props.description}</p>
        </div>
        <div className="adopt-btn">
          <button className="Home-button" onClick={handleAdoptClick}>
            Adopt a Pet <img src={footPrint} alt="footprint" />
          </button>
        </div>
      </div>
      <div className="homeContainer-right">
        <img src={girlHoldingADog} alt="Girl holding a dog" />
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        close={close}
        message="Please log in to adopt a pet."
      />
    </div>
  );
};

export default HomeLandingContainer;
