import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./images/logo.jpeg";
import MessageModal from "../MessageModal/MessageModal";
import "./Navbar.scss";

const Navbar = ({ title }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleRestrictedNavigation = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setIsModalOpen(true); // Open modal if user is not logged in
    }
  };

  const handleNorestriction = (path) => {
    navigate(path);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/login");
  };
  const close = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="navbar-container">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="Whiskers&Co Logo" />
          <p>{title}</p>
        </Link>
      </div>
      <div>
        <ul className="navbar-links">
          <li>
            <button onClick={() => handleNorestriction("/")}>Home</button>
          </li>
          <li>
            <button onClick={() => handleRestrictedNavigation("/services")}>
              Services
            </button>
          </li>

          <li>
            <button onClick={() => handleRestrictedNavigation("/pets")}>
              Pets
            </button>
          </li>
          <li>
            <button onClick={() => handleNorestriction("/contact")}>
              Contact
            </button>
          </li>
          {currentUser ? (
            <>
              <li className="profile-pic-container">
                <Link to="/profile">
                  <img
                    src={currentUser.img}
                    alt="User Profile"
                    className="profile-pic"
                  />
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
      <div>
        <button
          className="Navbar-button"
          onClick={() => handleRestrictedNavigation("/services")}
        >
          Give a Pet
        </button>
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        close={close}
        message="You have to log in to access this feature."
      />
    </div>
  );
};

export default Navbar;
