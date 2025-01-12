import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/NavBar/Navbar";
import Profile from "./Components/Profile.jsx";
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
import CommunicationPage from "./Components/Communication";
import "./App.css";

const Layout = ({ children }) => (
  <>
    <Navbar title="Whiskers-n-Co" />
    {children}
    <Footer title="Whiskers-n-Co" />
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
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
          path="/communication"
          element={
            <Layout>
              <CommunicationPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
