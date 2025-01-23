import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Box,
  Typography,
  Badge,
  IconButton,
} from "@mui/material";
import { Notifications } from "@mui/icons-material";
import NotificationsPage from "../NotificationPanel/NotificationsPage";
import MessageModal from "../MessageModal/MessageModal";
import logo from "./images/logo.jpeg";
import axios from "axios";

const Navbar = ({ title, children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // New state for unread count
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch notifications when the notification panel is opened
  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/notifications/notifications/unread",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  // Fetch notifications and mark as read
  const fetchAndMarkNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch notifications
      const response = await axios.get(
        `http://localhost:4000/notifications/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data);

      // Mark notifications as read
      await axios.put(
        "http://localhost:4000/notifications/notifications/read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error("Error fetching or marking notifications as read:", err);
    }
  };

  const handleToggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
    if (!isNotificationOpen) {
      fetchAndMarkNotificationsAsRead();
    }
  };

  const handleRestrictedNavigation = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    // Ensure the notification tab is closed on refresh
    fetchUnreadCount();
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
              { label: "Chats", path: "/communication" },
              { label: "News", path: "/news" },
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
                    : navigate(link.path)
                }
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Profile and Notifications */}
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
            {/* Notification Icon */}
            <IconButton onClick={handleToggleNotifications}>
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
        <MessageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          message="You have to log in to access this feature."
        />
      </AppBar>

      {/* Floating Notifications Panel */}
      {isNotificationOpen && (
        <NotificationsPage
          notifications={notifications}
          onClose={handleToggleNotifications}
        />
      )}

      {/* Render children */}
      {children && <Box>{React.cloneElement(children, { currentUser })}</Box>}
    </>
  );
};

export default Navbar;
