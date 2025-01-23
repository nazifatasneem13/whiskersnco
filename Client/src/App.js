import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Components/NavBar/Navbar";
import Profile from "./Components/Profile/Profile.jsx";
import Wishlist from "./Components/Profile/wishlist.js";
import MyPets from "./Components/Profile/mypets.js";
import NewsPage from "./Components/NewsPage/NewsPage.js";
import Home from "./Components/Home/Home";
import Login from "./Pages/login/Login.jsx";
import Register from "./Pages/register/Register.jsx";
import AdminLogin from "./Components/AdminPanel/AdminLogin";
import Preferences from "./Pages/register/Preferences";
import Services from "./Components/Services/Services";
import Contact from "./Components/Contact/Contact";
import Footer from "./Components/Footer/Footer";
import Pets from "./Components/Pets/Pets";
import AdoptForm from "./Components/AdoptForm/AdoptForm";
import NearbyVets from "./Components/NearbyVets/NearbyVets";
import TrainYourPet from "./Components/Train/TrainYourPet.js";
import PostPetSection from "./Components/Services/PostPetSection";
import AdoptSection from "./Components/Services/AdoptSection";
import CommunicationPage from "./Components/Communication/Communication";
import ChatbotPage from "./Components/ChatbotLoader";
import { Box, Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import Sidebar from "./Components/NavBar/Sidebar"; // Import Sidebar
import "./App.css";

// Layout Component that includes Navbar, Sidebar, and Footer
const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Sidebar - Fixed to the left and above Navbar */}
      <Sidebar />

      {/* Navbar - Fixed at the top, but will be behind the sidebar */}
      <Navbar title="Whiskers-n-Co" />

      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            padding: "1rem",

            transition: "margin-left 0.3s",
            "@media (max-width: 768px)": {
              marginLeft: "0", // Sidebar disappears for smaller screens
            },
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Footer - Fixed at the bottom */}
      <Footer title="Whiskers-n-Co" />
    </Box>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/post-pet"
          element={
            <Layout>
              <PostPetSection />
            </Layout>
          }
        />
        <Route
          path="/adopt-pet"
          element={
            <Layout>
              <AdoptSection />
            </Layout>
          }
        />
        <Route
          path="/preferences"
          element={
            <Layout>
              <Preferences />
            </Layout>
          }
        />
        <Route
          path="/pets"
          element={
            <Layout>
              <Pets />
            </Layout>
          }
        />
        <Route
          path="/trainpets"
          element={
            <Layout>
              <TrainYourPet />
            </Layout>
          }
        />
        <Route
          path="/adopt-form"
          element={
            <Layout>
              <AdoptForm />
            </Layout>
          }
        />
        <Route
          path="/nearby-vets"
          element={
            <Layout>
              <NearbyVets />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/services"
          element={
            <Layout>
              <Services />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/news"
          element={
            <Layout>
              <NewsPage />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route path="/admin-111424" element={<AdminLogin />} />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <Layout>
              <Wishlist />
            </Layout>
          }
        />
        <Route
          path="/mypets"
          element={
            <Layout>
              <MyPets />
            </Layout>
          }
        />
        <Route
          path="/communication"
          element={
            <Layout>
              <CommunicationPage />
            </Layout>
          }
        />
        <Route
          path="/chatbot"
          element={
            <Layout>
              <ChatbotPage />
            </Layout>
          }
        />
      </Routes>

      {/* Floating Button that links to /chatbot */}
      <Link to="/chatbot" style={{ textDecoration: "none" }}>
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 9999, // ensure it sits on top
          }}
        >
          <ChatIcon />
        </Fab>
      </Link>
    </Router>
  );
};

export default App;
