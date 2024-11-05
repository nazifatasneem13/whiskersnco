import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    petTypes: [], // Use arrays for multiple selections
    vaccinationStatuses: [],
    preferredPetTypes: [],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setPreferences((prev) => {
      const selected = prev[name];
      if (checked) {
        return { ...prev, [name]: [...selected, value] }; // Add selected option
      } else {
        return { ...prev, [name]: selected.filter((item) => item !== value) }; // Remove unselected option
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post(
        "http://localhost:4000/users/preferences",
        preferences
      );
      setSuccessMessage("Preferences saved successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/login"); // Redirect to login page
      }, 3000);
    } catch (err) {
      console.error("Failed to save preferences:", err);
    }
  };

  return (
    <div>
      <h1>Select Your Preferences</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Pet Types</legend>
          <label>
            <input
              type="checkbox"
              name="petTypes"
              value="dog"
              onChange={handleCheckboxChange}
            />
            Dog
          </label>
          <label>
            <input
              type="checkbox"
              name="petTypes"
              value="cat"
              onChange={handleCheckboxChange}
            />
            Cat
          </label>
          <label>
            <input
              type="checkbox"
              name="petTypes"
              value="bird"
              onChange={handleCheckboxChange}
            />
            Bird
          </label>
          <label>
            <input
              type="checkbox"
              name="petTypes"
              value="other"
              onChange={handleCheckboxChange}
            />
            Other
          </label>
        </fieldset>

        <fieldset>
          <legend>Vaccination Status</legend>
          <label>
            <input
              type="checkbox"
              name="vaccinationStatuses"
              value="vaccinated"
              onChange={handleCheckboxChange}
            />
            Vaccinated
          </label>
          <label>
            <input
              type="checkbox"
              name="vaccinationStatuses"
              value="non-vaccinated"
              onChange={handleCheckboxChange}
            />
            Non-Vaccinated
          </label>
        </fieldset>

        <fieldset>
          <legend>Preferred Pet Types</legend>
          <label>
            <input
              type="checkbox"
              name="preferredPetTypes"
              value="stray"
              onChange={handleCheckboxChange}
            />
            Stray
          </label>
          <label>
            <input
              type="checkbox"
              name="preferredPetTypes"
              value="domesticated"
              onChange={handleCheckboxChange}
            />
            Domesticated
          </label>
        </fieldset>

        <button type="submit">Save Preferences</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default Preferences;
