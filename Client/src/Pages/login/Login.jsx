import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "./login.jpeg";
import {
  Box,
  Typography,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Container,
  Card,
  CardContent,
  Link as MuiLink, // Import MUI's Link component
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const handleGoogleLogin = async () => {
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
                display: "left",

                width: "100%",
                position: "left",
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
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 1,
                  backgroundColor: "#121858", // Midnight Blue
                  color: "white", // Ensure text color contrasts well
                  "&:hover": {
                    backgroundColor: "#0f144d", // Slightly darker shade for hover effect
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
                sx={{
                  mb: 1,
                }}
                onClick={handleGoogleLogin}
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
    </ThemeProvider>
  );
};

export default Login;
