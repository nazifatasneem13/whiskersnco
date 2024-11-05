import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });
  const [emailError, setEmailError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };



 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user.email.includes("@")) {
    setEmailError("Please enter a valid email address.");
    return;
  }
  setEmailError(""); // Clear any previous error message
  const url = await upload(file);
  try {
    await newRequest.post("http://localhost:4000/auth/register", {
      ...user,
      img: url,
    });
    setSignupSuccess(true);
    setTimeout(() => {
      setSignupSuccess(false);
    }, 3000);
    navigate("/preferences"); // Navigate to preferences page
  } catch (err) {
    console.log(err);
  }
};


  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="Your username"
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="youremail@example.com"
            onChange={handleChange}
          />
          {emailError && <p className="error">{emailError}</p>}
          {signupSuccess && <p className="success">Signup successful!</p>}
          <label>Password</label>
          <input name="password" type="password" onChange={handleChange} />
          <label>Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      
          <button type="submit">Register</button>
        </div>
   
      </form>
    </div>
  );
};

export default Register;
