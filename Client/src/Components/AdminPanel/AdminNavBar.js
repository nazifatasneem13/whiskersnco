// src/Components/AdminNavBar.js

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

function AdminNavBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Brand Name */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>

        {/* Current Time */}
        <Typography variant="body1" sx={{ marginRight: 2 }}>
          {currentTime.toLocaleString()}
        </Typography>

        {/* Logout Button */}
        <Button
          color="secondary"
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default AdminNavBar;
