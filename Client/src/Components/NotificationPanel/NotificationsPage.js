import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  Badge,
  Tooltip,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

const NotificationsPage = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/notifications/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 67,
        right: 20,
        width: 320,
        maxHeight: 500,
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
        borderRadius: 3,
        zIndex: 1300,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 30px",
          backgroundColor: "#19275c",
          color: "#fff",
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Notifications
        </Typography>
        <Tooltip title="Close">
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Notifications List */}
      <List sx={{ padding: 0 }}>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  padding: "16px 24px",
                  "&:hover": {
                    backgroundColor: "#f0f8ff",
                  },
                }}
              >
                <Badge
                  color="primary"
                  variant={notification.isNew ? "dot" : "standard"}
                  sx={{ marginRight: 2 }}
                >
                  <Avatar sx={{ bgcolor: "#19275c", color: "#fff" }}>
                    <NotificationsNoneIcon />
                  </Avatar>
                </Badge>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <Box sx={{ padding: 3, textAlign: "center" }}>
            <NotificationsNoneIcon sx={{ fontSize: 48, color: "#ccc" }} />
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", marginTop: 2 }}
            >
              No notifications available.
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default NotificationsPage;
