/*
 * File: pet_adoption_frontend.js
 * Description: Comprehensive JavaScript module for a Pet Adoption Website Frontend.
 * It covers:
 * - Data modeling for pets
 * - Dynamic rendering of the pet gallery
 * - Advanced filtering, sorting, and search functionalities
 * - Form validation for contact, login, and registration forms
 * - Modal management for login and registration
 * - Utility functions and simulated API interactions
 *
 * All code is wrapped in an IIFE to avoid polluting the global namespace.
 */

(function () {
  "use strict";

  // Create a global namespace for our project if not already present
  window.PetAdoption = window.PetAdoption || {};

  // ===========================
  // Data Models and Structures
  // ===========================

  // Pet constructor function
  function Pet(options) {
    this.id = options.id;
    this.name = options.name;
    this.species = options.species;
    this.ageGroup = options.ageGroup;
    this.image = options.image;
    this.description = options.description;
  }

  // Sample pet data array (could be fetched from an API)
  const petData = [
    new Pet({ id: 1, name: "Buddy", species: "Dog", ageGroup: "Puppy/Kitten", image: "dog1.jpg", description: "Friendly and energetic dog looking for a loving home." }),
    new Pet({ id: 2, name: "Whiskers", species: "Cat", ageGroup: "Adult", image: "cat1.jpg", description: "Calm and affectionate cat with a gentle nature." }),
    new Pet({ id: 3, name: "Tweety", species: "Bird", ageGroup: "Adult", image: "bird1.jpg", description: "Cheerful bird with vibrant colors." }),
    new Pet({ id: 4, name: "Hopper", species: "Rabbit", ageGroup: "Adult", image: "rabbit1.jpg", description: "Playful rabbit who loves to hop around." }),
    new Pet({ id: 5, name: "Max", species: "Dog", ageGroup: "Adult", image: "dog2.jpg", description: "Loyal and protective dog ready for a new home." }),
    new Pet({ id: 6, name: "Shadow", species: "Cat", ageGroup: "Senior", image: "cat2.jpg", description: "Independent and curious cat seeking a quiet environment." }),
    new Pet({ id: 7, name: "Coco", species: "Dog", ageGroup: "Puppy/Kitten", image: "dog3.jpg", description: "Energetic puppy with a playful spirit." }),
    new Pet({ id: 8, name: "Luna", species: "Cat", ageGroup: "Adult", image: "cat3.jpg", description: "Elegant cat with a mysterious charm." })
  ];

  // ===============================
  // Utility Functions and Helpers
  // ===============================

  // Helper to get element by ID
  function $(id) {
    return document.getElementById(id);
  }

  // Function to create a DOM element with attributes and innerHTML
  function createElement(tag, attrs, innerHTML) {
    const element = document.createElement(tag);
    for (let key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        element.setAttribute(key, attrs[key]);
      }
    }
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  // Debounce function to limit rapid function calls (useful for search input)
  function debounce(func, delay) {
    let timer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        func.apply(context, args);
      }, delay);
    };
  }

  // ==========================
  // Rendering and DOM Updates
  // ==========================

  // PetGallery class manages pet rendering and filtering
  class PetGallery {
    constructor(petArray, containerId) {
      this.petArray = petArray;
      this.container = $(containerId);
      this.filteredPets = petArray.slice(); // initialize with all pets
    }

    // Render pet cards into the container
    render() {
      this.container.innerHTML = "";
      if (this.filteredPets.length === 0) {
        this.container.innerHTML = "<div class='col-12 text-center'><p>No pets match your criteria.</p></div>";
        return;
      }
      this.filteredPets.forEach((pet) => {
        const col = createElement("div", { class: "col-md-4" });
        col.innerHTML = `
          <div class="pet-card">
            <img src="${pet.image}" alt="${pet.name}" class="img-fluid">
            <div class="card-body">
              <h5 class="card-title">${pet.name}</h5>
              <p class="card-text">${pet.description}</p>
              <p><strong>Species:</strong> ${pet.species} | <strong>Age Group:</strong> ${pet.ageGroup}</p>
              <button class="btn btn-primary" onclick="PetAdoption.handleAdopt(${pet.id})">Adopt</button>
            </div>
          </div>
        `;
        this.container.appendChild(col);
      });
    }

    // Filter pets based on search text, species, and age group
    filter(searchText, species, ageGroup) {
      searchText = searchText.toLowerCase();
      this.filteredPets = this.petArray.filter((pet) => {
        const matchesName = pet.name.toLowerCase().includes(searchText);
        const matchesSpecies = species === "" || pet.species === species;
        const matchesAge = ageGroup === "" || pet.ageGroup === ageGroup;
        return matchesName && matchesSpecies && matchesAge;
      });
      this.render();
    }

    // Sort pets by a given property ('name', 'species', or 'ageGroup')
    sortBy(property) {
      this.filteredPets.sort((a, b) => {
        if (a[property] < b[property]) return -1;
        if (a[property] > b[property]) return 1;
        return 0;
      });
      this.render();
    }
  }

  // Initialize gallery instance and attach to global namespace for access from HTML inline handlers.
  const petGallery = new PetGallery(petData, "petList");
  window.PetAdoption.petGallery = petGallery;

  // ===========================
  // Event Listeners and Handlers
  // ===========================

  // Handle filtering when user clicks "Apply Filters" button
  function applyFilters() {
    const searchInput = $("searchInput").value;
    const speciesFilter = $("speciesFilter").value;
    const ageFilter = $("ageFilter").value;
    petGallery.filter(searchInput, speciesFilter, ageFilter);
  }

  // Attach a debounced keyup event for search input
  if ($("searchInput")) {
    $("searchInput").addEventListener("keyup", debounce(applyFilters, 300));
  }

  // Expose applyFilters to the global namespace so it can be called inline
  window.PetAdoption.applyFilters = applyFilters;

  // Handle adoption action when "Adopt" button is clicked
  function handleAdopt(petId) {
    const pet = petData.find((p) => p.id === petId);
    if (pet) {
      alert("Thank you for choosing to adopt " + pet.name + "!\nPlease fill out the adoption form for further processing.");
      // In a real-world scenario, trigger additional workflows here (e.g., open adoption form)
    } else {
      alert("Error: Pet not found.");
    }
  }

  // Expose adoption handler
  window.PetAdoption.handleAdopt = handleAdopt;

  // ========================
  // Form Validation & Logic
  // ========================

  // Validate email format
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Handle Contact Form Submission
  function handleContactFormSubmit(event) {
    event.preventDefault();
    const name = $("contactName").value.trim();
    const email = $("contactEmail").value.trim();
    const message = $("contactMessage").value.trim();
    const feedback = $("contactFeedback");

    if (name === "" || email === "" || message === "") {
      feedback.innerHTML = "<div class='alert alert-danger'>All fields are required.</div>";
      return;
    }
    if (!isValidEmail(email)) {
      feedback.innerHTML = "<div class='alert alert-danger'>Please enter a valid email address.</div>";
      return;
    }
    // Simulate API call
    setTimeout(() => {
      feedback.innerHTML = "<div class='alert alert-success'>Thank you for your message. We will respond shortly.</div>";
      document.getElementById("contactForm").reset();
    }, 500);
  }

  // Handle Login Form Submission
  function handleLoginFormSubmit(event) {
    event.preventDefault();
    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value.trim();
    const feedback = $("loginFeedback");

    if (email === "" || password === "") {
      feedback.innerHTML = "<div class='alert alert-danger'>Email and password are required.</div>";
      return;
    }
    if (!isValidEmail(email)) {
      feedback.innerHTML = "<div class='alert alert-danger'>Invalid email format.</div>";
      return;
    }
    // Simulate login API call
    setTimeout(() => {
      feedback.innerHTML = "<div class='alert alert-success'>Login successful! Redirecting...</div>";
      document.getElementById("loginForm").reset();
      setTimeout(() => {
        $("#loginModal").modal("hide");
      }, 1500);
    }, 500);
  }

  // Handle Registration Form Submission
  function handleRegisterFormSubmit(event) {
    event.preventDefault();
    const name = $("registerName").value.trim();
    const email = $("registerEmail").value.trim();
    const password = $("registerPassword").value.trim();
    const feedback = $("registerFeedback");

    if (name === "" || email === "" || password === "") {
      feedback.innerHTML = "<div class='alert alert-danger'>All fields are required for registration.</div>";
      return;
    }
    if (!isValidEmail(email)) {
      feedback.innerHTML = "<div class='alert alert-danger'>Enter a valid email address.</div>";
      return;
    }
    // Simulate registration API call
    setTimeout(() => {
      feedback.innerHTML = "<div class='alert alert-success'>Registration successful! Welcome aboard.</div>";
      document.getElementById("registerForm").reset();
      setTimeout(() => {
        $("#registerModal").modal("hide");
      }, 1500);
    }, 500);
  }

  // Attach form event listeners when DOM is loaded
  document.addEventListener("DOMContentLoaded", function () {
    if ($("contactForm")) {
      $("contactForm").addEventListener("submit", handleContactFormSubmit);
    }
    if ($("loginForm")) {
      $("loginForm").addEventListener("submit", handleLoginFormSubmit);
    }
    if ($("registerForm")) {
      $("registerForm").addEventListener("submit", handleRegisterFormSubmit);
    }
    // Initial render of all pets
    petGallery.render();
  });

  // ===========================
  // Additional Features Section
  // ===========================

  // Sorting functionality (can be extended further)
  function sortPetsBy(property) {
    petGallery.sortBy(property);
  }
  window.PetAdoption.sortPetsBy = sortPetsBy;

  // Simulated API call to fetch additional pet data (placeholder for real API integration)
  function fetchAdditionalPets() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulated additional data
        const morePets = [
          new Pet({ id: 9, name: "Bella", species: "Dog", ageGroup: "Adult", image: "dog4.jpg", description: "Friendly and playful dog looking for a family." }),
          new Pet({ id: 10, name: "Milo", species: "Cat", ageGroup: "Puppy/Kitten", image: "cat4.jpg", description: "Curious kitten full of energy." })
        ];
        resolve(morePets);
      }, 1000);
    });
  }

  // Function to load additional pets into the gallery
  function loadMorePets() {
    fetchAdditionalPets().then((morePets) => {
      petGallery.petArray = petGallery.petArray.concat(morePets);
      petGallery.filter($("searchInput").value, $("speciesFilter").value, $("ageFilter").value);
    });
  }
  window.PetAdoption.loadMorePets = loadMorePets;

  // ========================================
  // End of pet_adoption_frontend.js Module
  // ========================================

  console.log("Pet Adoption Frontend JS loaded successfully.");

})();
