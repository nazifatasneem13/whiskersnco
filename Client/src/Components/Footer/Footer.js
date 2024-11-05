import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.jpeg";

const Footer = (props) => {
  return (
    <footer className="footer">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="Whiskers&Co Logo" />
          <p>{props.title}</p>
        </Link>
      </div>
      <div className="below-footer">
        <p>You can reach me at </p>
        <p>
          <a className="mail-links" href="mailto:nabilaislam21@iut-dhaka.edu">
            nabilaislam21@iut-dhaka.edu
          </a>
        </p>{" "}
        <p>
          <a className="mail-links" href="mailto:nazifatasneem@iut-dhaka.edu">
            nazifatasneem@iut-dhaka.edu
          </a>
        </p>
        <p>
          <a className="mail-links" href="mailto:tasniaanwer@iut-dhaka.edu">
            tasniaanwer@iut-dhaka.edu
          </a>
        </p>
        <p>&copy; 2024 whiskers&co</p>
      </div>
    </footer>
  );
};

export default Footer;
