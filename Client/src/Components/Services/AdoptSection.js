import React from "react";
import adoptPet from "./images/adoptPet.jpeg";
import { Link } from "react-router-dom";

const AdoptSection = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section className="adopt-section">
      <h2>Adopt a Pet</h2>
      <img src={adoptPet} alt="Happy Pet" />

      <p>
        Discover the joys of adopting a pet with our dedicated program.
        Embracing a pet into your home fills it with laughter and love.
      </p>

      <h3>Why Adopt?</h3>
      <ul>
        <li>Give a forever home to a pet that needs you</li>
        <li>Gain a loyal companion who will bring endless affection</li>
        <li>Forge unforgettable bonds and make heartwarming memories</li>
      </ul>

      <h3>How to Adopt</h3>
      <ol>
        <li>Submit your application for adoption</li>
        <li>Visit with your potential new companion</li>
        <li>Finalize the adoption with our support</li>
      </ol>

      <h3>What It Means to Be a Pet Owner</h3>
      <p>
        Being a pet owner is a rewarding commitment that includes caring for
        your pet's everyday needs, such as nutrition, grooming, exercise, and
        health care.
      </p>

      <Link to="/pets">
        <button className="cta-button" onClick={scrollToTop}>
          Find Your Perfect Pet
        </button>
      </Link>
    </section>
  );
};

export default AdoptSection;
