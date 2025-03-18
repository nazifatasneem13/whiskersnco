import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "./login.jpeg";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { auth, provider, signInWithPopup } from "../../firebase";
import newRequest from "../../utils/newRequest.js";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f7f7f7",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
    primary: {
      main: "#121858",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h5: {
      fontWeight: 700,
    },
    body2: {
      fontSize: "0.9rem",
    },
  },
});

const Login = () => {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // State for verification dialog, human check, and login method
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [loginMethod, setLoginMethod] = useState(""); // "normal" or "google"

  // Drag and drop handlers for pinky promise in dialog
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", "pinky-promise");
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (data === "pinky-promise") {
      setIsHumanVerified(true);
    }
  };

  // Open verification dialog for regular login
  const handleLoginClick = (e) => {
    e.preventDefault();
    setLoginMethod("normal");
    setVerificationDialogOpen(true);
  };

  // Open verification dialog for Google login
  const handleGoogleLoginClick = (e) => {
    e.preventDefault();
    setLoginMethod("google");
    setVerificationDialogOpen(true);
  };

  // Function to actually call the login API after human verification
  const submitLogin = async () => {
    try {
      const res = await newRequest.post("http://localhost:4000/auth/login", {
        username,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (!user.areas || user.areas.length === 0) {
        navigate("/preferences");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  // Google login logic remains unchanged
  const submitGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      const res = await newRequest.post(
        "http://localhost:4000/auth/google-login",
        {
          uid: googleUser.uid,
          username: googleUser.displayName,
          email: googleUser.email,
          img: googleUser.photoURL,
        }
      );
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (!user.areas || user.areas.length === 0) {
        navigate("/preferences");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      setError("Google login failed. Please try again.");
    }
  };

  // Called when user confirms the pinky promise verification in the dialog
  const handleDialogConfirm = async () => {
    if (isHumanVerified) {
      setVerificationDialogOpen(false);
      // Reset verification state for future attempts
      setIsHumanVerified(false);
      // Trigger the appropriate login flow
      if (loginMethod === "normal") {
        await submitLogin();
      } else if (loginMethod === "google") {
        await submitGoogleLogin();
      }
      // Reset login method
      setLoginMethod("");
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            display: "flex",
            width: "80%",
            maxHeight: 500,
            maxWidth: 700,
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          }}
        >
          {/* Left Side - Welcome Section */}
          <Box
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              padding: 0.5,
              width: "40%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={image}
              alt="Logo"
              style={{
                display: "block",
                width: "100%",
                cursor: "pointer",
              }}
            />
          </Box>

          {/* Right Side - Sign In Section */}
          <CardContent
            sx={{
              width: "60%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 4,
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
              Sign In
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: 10, mb: 1, textAlign: "center" }}
            >
              Become a member of whiskers-n-co to enjoy our full facilities
            </Typography>

            <Box component="form" sx={{ width: "100%", mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Instead of submitting immediately, open the verification dialog */}
              <Button
                fullWidth
                variant="contained"
                onClick={handleLoginClick}
                sx={{
                  mt: 3,
                  mb: 1,
                  backgroundColor: "#121858",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#0f144d",
                  },
                }}
              >
                Login
              </Button>

              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              <Typography align="center" variant="body2" sx={{ mt: 3 }}>
                or
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 1 }}
                onClick={handleGoogleLoginClick}
              >
                Sign in with Google
              </Button>
              <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                <Grid item>
                  <Link to="/register">
                    <MuiLink variant="body2">
                      {"Don't have an account?"}
                    </MuiLink>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Verification Dialog with Pinky Promise */}
      <Dialog
        open={verificationDialogOpen}
        onClose={() => setVerificationDialogOpen(false)}
      >
        <DialogTitle>Human Verification</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 1,
          }}
        >
          <Typography variant="body2">
            Drag the pinky icon to the circle to verify you’re human:
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Draggable Pinky Icon: Render only if not yet dropped */}
            {!isHumanVerified && (
              <Box
                draggable
                onDragStart={handleDragStart}
                sx={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#0288d1",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "grab",
                  marginRight: 2,
                  transition: "transform 0.3s ease",
                }}
              >
                <Typography variant="body1" sx={{ color: "white" }}>
                  🤞
                </Typography>
              </Box>
            )}

            {/* Drop Target */}
            <Box
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{
                width: 60,
                height: 60,
                border: "2px dashed #0288d1",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isHumanVerified ? (
                // When verified, render the pinky icon here so it fills the space
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#0288d1",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body1" sx={{ color: "white" }}>
                    🤞
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "#0288d1" }}>
                  Drop Here
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerificationDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDialogConfirm}
            disabled={!isHumanVerified}
            sx={{
              backgroundColor: "#0288d1",
              color: "white",
              "&:hover": { backgroundColor: "#0288d1" },
            }}
          >
            Confirm and Login
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Login;
