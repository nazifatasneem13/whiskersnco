// Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import upload from "../utils/upload.js"; // Adjust the path accordingly

const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    img: "",
    // Add other user fields as necessary
  });
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // Adjust if using a different storage
        const res = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, []);

  // Handle form submission for updating profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    // Verify password
    if (!password) {
      setMessage("Please enter your current password to update your profile.");
      return;
    }

    // Optional: Handle password change
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      let imageUrl = user.img;
      if (profileImage) {
        // Upload image to Cloudinary
        imageUrl = await upload(profileImage);
      }

      // Prepare update data
      const updateData = {
        ...user,
        img: imageUrl,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      // Send update request with password verification
      // Assuming your backend requires the current password for updates
      const res = await axios.put("/update", updateData, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password }, // Send password in the request body or as required by your backend
      });

      setUser(res.data);
      setMessage("Profile updated successfully.");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setProfileImage(null);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    // Redirect to login page or perform other logout actions
    window.location.href = "/login";
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {message && <p className="message">{message}</p>}
      <div className="profile-info">
        <img
          src={user.img || "/default-pfp.png"} // Provide a default image if none
          alt="Profile"
          className="profile-pfp"
        />
        <form onSubmit={handleUpdate} className="profile-form">
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
          {/* Add other user fields as necessary */}
          <div>
            <label>Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>
          <hr />
          <h3>Change Password</h3>
          <div>
            <label>Current Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Profile;
