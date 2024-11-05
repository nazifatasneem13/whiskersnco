import React from "react";
import developerPng from "./images/developer-png.jpeg";

const Contact = () => {
  return (
    <div className="contactUs-main-container">
      <div className="contactUs-pic">
        <img src={developerPng} alt="Profile" />
      </div>
      <div className="contactUs-left-para">
        <h4>ID: 210042111</h4>
        <h4>Name: Nabila Islam</h4>

        <i className="fa fa-envelope"></i>
        <a className="mail-links" href="mailto:nabilaislam21@iut-dhaka.edu">
          nabilaislam21@iut-dhaka.edu
        </a>

        <i className="fa fa-github"></i>
        <a className="mail-links" href="https://github.com/nabila-sheona">
          nabila-sheona
        </a>
      </div>

      <div className="contactUs-left-para">
        <h4>ID: 210042114</h4>
        <h4>Name: Nazifa Tasneem</h4>

        <i className="fa fa-envelope"></i>
        <a className="mail-links" href="mailto:nazifatasneem@iut-dhaka.edu">
          nazifatasneem@iut-dhaka.edu
        </a>

        <i className="fa fa-github"></i>
        <a className="mail-links" href="https://github.com/nazifatasneem13">
          nazifatasneem13
        </a>
      </div>

      {/* Repeated Entry 2 */}
      <div className="contactUs-left-para">
        <h4>ID: 210042124</h4>
        <h4>Name: Tasnia Anwer</h4>

        <i className="fa fa-envelope"></i>
        <a className="mail-links" href="mailto:tasniaanwer@iut-dhaka.edu">
          tasniaanwer@iut-dhaka.edu
        </a>

        <i className="fa fa-github"></i>
        <a className="mail-links" href="https://github.com/tasniaanwer">
          tasniaanwer
        </a>
      </div>
    </div>
  );
};

export default Contact;
