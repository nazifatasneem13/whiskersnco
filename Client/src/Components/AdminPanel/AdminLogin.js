// src/Components/AdminLogin.js

import React, { useState, useEffect } from "react";
import AdminPanel from "./AdminPanel";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
const AdminLogin = () => {
  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Login State
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Users Data
  const [usersData, setUsersData] = useState([]);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch Users Data on Component Mount
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetch("http://localhost:4000/admin/credentials");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setUsersData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: "Error fetching user data.",
          severity: "error",
        });
      }
    };

    fetchUsersData();
  }, []);

  // Handle Login
  const handleLogin = () => {
    const user =
      usersData.username === username && usersData.password === password;
    if (user) {
      setLoginSuccess(true);
      setShowErrorMessage(false);
      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });
    } else {
      setLoginSuccess(false);
      setShowErrorMessage(true);
      setSnackbar({
        open: true,
        message: "Incorrect username or password.",
        severity: "error",
      });
    }
  };

  // Handle Snackbar Close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        {loginSuccess ? (
          <AdminPanel />
        ) : (
          <Box
            sx={{
              backgroundColor: "background.paper",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
              maxWidth: 400,
              width: "100%",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              color="primary"
            >
              Admin Login
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
              <TextField
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
              />
              <TextField
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
              />
              {showErrorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Incorrect username or password.
                </Alert>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Box>
          </Box>
        )}

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLogin;
