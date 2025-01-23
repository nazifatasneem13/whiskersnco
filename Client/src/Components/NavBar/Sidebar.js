import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Snackbar,
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  Pets as PetsIcon,
  LocalHospital as VetsIcon,
  Favorite as WishlistIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Train as TrainIcon,
  AccountCircle as ProfileIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  ArrowBackIos as ArrowBackIosIcon,
} from "@mui/icons-material";
import logo from "./images/logo.jpeg";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import MessageModal from "../MessageModal/MessageModal";

const Sidebar = ({ title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRestrictedNavigation = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setIsModalOpen(true); // Show the login modal if not logged in
    }
  };

  useEffect(() => {
    // Validate user on page load
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));

    const restrictedRoutes = ["/profile", "/services", "/pets", "/mypets"];
    const isRestrictedRoute = restrictedRoutes.includes(location.pathname);

    if (isRestrictedRoute && (!token || !storedUser)) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      navigate("/login");
    } else {
      setCurrentUser(storedUser);
    }
  }, [location, navigate]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: isCollapsed ? "70px" : "250px",
        height: "100%",
        backgroundColor: "#004d6d",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 10,
        transition: "width 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* Sidebar Content */}
      <Box
        sx={{
          marginTop: "10vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "40px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        />

        {/* Title */}
        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "20px" }}
          >
            {title || "Whiskers-n-Co"}
          </Typography>
        )}
      </Box>

      {/* Toggle Button */}
      <IconButton
        onClick={handleToggle}
        sx={{
          position: "absolute",
          top: 20,
          right: -20,
          zIndex: 15,
          backgroundColor: "#004d6d",
          color: "#fff",
        }}
      >
        {isCollapsed ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
      </IconButton>

      {/* Top Section */}
      <Box sx={{ paddingTop: "20px" }}>
        {currentUser && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              backgroundColor: "#005d7f",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            <Avatar
              src={currentUser.img || ""}
              alt={currentUser.username || "User"}
              sx={{
                width: "50px",
                height: "50px",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/profile")}
            />
            {!isCollapsed && (
              <Typography sx={{ fontWeight: "bold" }}>
                {currentUser.username || "User"}
              </Typography>
            )}
          </Box>
        )}

        {/* Navigation Links */}
        <Box sx={{ padding: "10px" }}>
          {[
            { label: "Home", icon: <HomeIcon />, path: "/" },
            { label: "Wishlist", icon: <WishlistIcon />, path: "/wishlist" },
            { label: "My Pets", icon: <ProfileIcon />, path: "/mypets" },
            {
              label: "Give a Pet",
              icon: <VolunteerActivismIcon />,
              path: "/post-pet",
            },
            { label: "Find Pets", icon: <PetsIcon />, path: "/pets" },
            {
              label: "Train Pets",
              icon: <FitnessCenterIcon />,
              path: "/trainpets",
            },
            { label: "Find Vets", icon: <VetsIcon />, path: "/nearby-vets" },
          ].map((item) => (
            <Tooltip key={item.label} title={item.label}>
              <Box
                sx={{
                  textDecoration: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  backgroundColor:
                    location.pathname === item.path ? "#19275c" : "#005d7f",
                  transition: "all 0.3s",
                }}
                onClick={() => handleRestrictedNavigation(item.path)}
              >
                {item.icon}
                {!isCollapsed && (
                  <Typography sx={{ marginLeft: "10px" }}>
                    {item.label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ padding: "10px" }}>
        {!currentUser && (
          <Box
            sx={{
              textDecoration: "none",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              backgroundColor: "#005d7f",
              transition: "all 0.3s",
            }}
            onClick={handleLogin}
          >
            <LoginIcon />
            {!isCollapsed && (
              <Typography sx={{ marginLeft: "10px" }}>Login</Typography>
            )}
          </Box>
        )}
        {currentUser && (
          <Box
            sx={{
              textDecoration: "none",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "5px",
              backgroundColor: "#005d7f",
              transition: "all 0.3s",
            }}
            onClick={handleLogout}
          >
            <LogoutIcon />
            {!isCollapsed && (
              <Typography sx={{ marginLeft: "10px" }}>Logout</Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Snackbar for Login Message */}
      <Snackbar
        open={openSnackbar}
        message="Please log in to access this page"
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      />
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message="You have to log in to access this feature."
      />
    </Box>
  );
};

export default Sidebar;
