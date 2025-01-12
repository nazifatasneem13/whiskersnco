// src/theme.js

import { createTheme } from "@mui/material/styles";

// Define custom colors
const darkPurple = "#4B0082"; // Indigo color
const white = "#FFFFFF";

const theme = createTheme({
  palette: {
    primary: {
      main: darkPurple,
      contrastText: white,
    },
    secondary: {
      main: white,
      contrastText: darkPurple,
    },
    background: {
      default: "#f5f5f5",
      paper: white,
    },
    error: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

export default theme;
