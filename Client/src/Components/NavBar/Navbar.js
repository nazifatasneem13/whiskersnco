import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import MessageModal from "../MessageModal/MessageModal";
import logo from "./images/logo.jpeg";

const Navbar = ({ title, children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateUser = () => {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));

      const restrictedRoutes = ["/profile", "/services", "/pets"];
      const isRestrictedRoute = restrictedRoutes.includes(location.pathname);

      if (isRestrictedRoute && (!token || !storedUser)) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        navigate("/login");
      } else {
        setCurrentUser(storedUser);
      }
    };

    validateUser();
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  const handleRestrictedNavigation = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setIsModalOpen(true);
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
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          padding: "10px 20px",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={2}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "40px", borderRadius: "50%" }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  {title || "Whiskers-n-Co"}
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Navigation Links */}
          <Box display="flex" gap={2} alignItems="center">
            {[
              { label: "Home", path: "/" },
              { label: "Services", path: "/services" },
              { label: "Pets", path: "/pets" },
              { label: "Find Vets", path: "/nearby-vets" },
              { label: "Train", path: "/trainpets" },
              { label: "Contact", path: "/contact" },
              { label: "Communication", path: "/communication" },
            ].map((link) => (
              <Button
                key={link.path}
                variant="text"
                sx={{
                  textTransform: "capitalize",
                  backgroundColor:
                    location.pathname === link.path ? "#19275c" : "transparent",
                  color: location.pathname === link.path ? "#fff" : "#000",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  "&:hover": {
                    backgroundColor: "#19275c",
                    color: "#fff",
                  },
                }}
                onClick={() =>
                  link.path === "/services" || link.path === "/pets"
                    ? handleRestrictedNavigation(link.path)
                    : handleNorestriction(link.path)
                }
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Profile and Action Buttons */}
          <Box display="flex" alignItems="center" gap={2}>
            {currentUser ? (
              <>
                <Avatar
                  src={currentUser.img || ""}
                  alt={currentUser.username || "User"}
                  sx={{
                    width: "40px",
                    height: "40px",
                    border: "2px solid #19275c",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/profile")}
                />
                <Button
                  variant="text"
                  sx={{
                    color: "#000",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  borderColor: "#19275c",
                  color: "#19275c",
                  "&:hover": {
                    backgroundColor: "#19275c",
                    color: "#fff",
                  },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#19275c",
                borderRadius: "20px",
                color: "#fff",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#00aaff",
                },
              }}
              onClick={() => handleRestrictedNavigation("/services")}
            >
              Give a Pet
            </Button>
          </Box>
        </Toolbar>
        <MessageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          close={close}
          message="You have to log in to access this feature."
        />
      </AppBar>
      {/* Render children if provided */}
      {children ? (
        <Box>{React.cloneElement(children, { currentUser })}</Box>
      ) : null}
    </>
  );
};

export default Navbar;
