/*
 * File: pet_adoption_app.js
 * Description: A comprehensive JavaScript application module for a Pet Adoption website.
 * It contains:
 *  - Data models for pets and users
 *  - A dynamic pet gallery with advanced filtering, sorting, and pagination
 *  - User authentication and session management
 *  - Form handling with robust validation and error logging
 *  - Analytics tracking and notifications
 *  - Offline caching simulation for resilience
 *  - Utility functions, event management, and simulated API interactions
 *
 * All code is encapsulated within an IIFE to avoid polluting the global namespace.
 */

(function () {
  "use strict";

  // Create a global namespace if not already present
  window.PetAdoptionApp = window.PetAdoptionApp || {};

  // ================================
  // Section 1: Data Models and Cache
  // ================================

  // Pet model using ES6 class syntax
  class Pet {
    constructor({ id, name, species, ageGroup, image, description, available = true }) {
      this.id = id;
      this.name = name;
      this.species = species;
      this.ageGroup = ageGroup;
      this.image = image;
      this.description = description;
      this.available = available;
    }
  }

  // User model for authentication
  class User {
    constructor({ id, name, email, password }) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password; // In a real app, never store plain text!
    }
  }

  // Simulated offline cache using localStorage (if available)
  const Cache = {
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error("Cache set error:", e);
      }
    },
    get: function (key) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (e) {
        console.error("Cache get error:", e);
        return null;
      }
    }
  };

  // ================================
  // Section 2: Utility Functions
  // ================================

  // Shorthand for document.getElementById
  function $(id) {
    return document.getElementById(id);
  }

  // Create a DOM element with attributes and innerHTML
  function createElement(tag, attrs, innerHTML) {
    const elem = document.createElement(tag);
    for (let key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        elem.setAttribute(key, attrs[key]);
      }
    }
    if (innerHTML) elem.innerHTML = innerHTML;
    return elem;
  }

  // Debounce function for throttling events (e.g., search input)
  function debounce(func, delay) {
    let timer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  // Basic email validator
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Log errors to console and simulated remote logging service
  function logError(message, error) {
    console.error("Error:", message, error);
    // Simulated remote logging call
    // In a real app, send error details to a server
  }

  // ================================
  // Section 3: Pet Gallery Module
  // ================================

  class PetGallery {
    constructor(pets = [], containerId = "petList") {
      this.allPets = pets;
      this.filteredPets = pets.slice();
      this.container = $(containerId);
      this.currentPage = 1;
      this.petsPerPage = 6;
    }

    // Render current page of pet cards
    render() {
      try {
        if (!this.container) return;
        this.container.innerHTML = "";
        const start = (this.currentPage - 1) * this.petsPerPage;
        const paginatedPets = this.filteredPets.slice(start, start + this.petsPerPage);
        if (paginatedPets.length === 0) {
          this.container.innerHTML = "<div class='col-12 text-center'><p>No pets found.</p></div>";
          return;
        }
        paginatedPets.forEach((pet) => {
          const card = createElement("div", { class: "col-md-4 mb-4" });
          card.innerHTML = `
            <div class="pet-card">
              <img src="${pet.image}" alt="${pet.name}" class="img-fluid">
              <div class="card-body">
                <h5 class="card-title">${pet.name}</h5>
                <p class="card-text">${pet.description}</p>
                <p><strong>Species:</strong> ${pet.species} | <strong>Age Group:</strong> ${pet.ageGroup}</p>
                <button class="btn btn-primary" onclick="PetAdoptionApp.handleAdopt(${pet.id})" ${!pet.available ? 'disabled' : ''}>${pet.available ? 'Adopt' : 'Not Available'}</button>
              </div>
            </div>
          `;
          this.container.appendChild(card);
        });
        this.renderPagination();
      } catch (error) {
        logError("Rendering pets failed", error);
      }
    }

    // Render pagination controls
    renderPagination() {
      const paginationContainer = $("paginationControls");
      if (!paginationContainer) return;
      paginationContainer.innerHTML = "";
      const totalPages = Math.ceil(this.filteredPets.length / this.petsPerPage);
      for (let i = 1; i <= totalPages; i++) {
        const btn = createElement("button", { class: "btn btn-secondary mx-1", "data-page": i }, i);
        if (i === this.currentPage) btn.disabled = true;
        btn.addEventListener("click", () => {
          this.currentPage = i;
          this.render();
        });
        paginationContainer.appendChild(btn);
      }
    }

    // Apply filters based on search text, species, and age group
    filter(searchText = "", species = "", ageGroup = "") {
      searchText = searchText.toLowerCase();
      this.filteredPets = this.allPets.filter((pet) => {
        const matchName = pet.name.toLowerCase().includes(searchText);
        const matchSpecies = species === "" || pet.species === species;
        const matchAge = ageGroup === "" || pet.ageGroup === ageGroup;
        return matchName && matchSpecies && matchAge;
      });
      this.currentPage = 1;
      this.render();
    }

    // Sort pets by a given property (name, species, ageGroup)
    sortBy(property) {
      this.filteredPets.sort((a, b) => (a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0));
      this.render();
    }

    // Add more pets (e.g., from a simulated API call)
    addPets(newPets) {
      this.allPets = this.allPets.concat(newPets);
      this.filter(); // reapply filter to include new pets
    }
  }

  // ================================
  // Section 4: User Authentication Module
  // ================================

  class UserAuth {
    constructor() {
      // Simulated user store; in real life, use secure backend systems.
      this.users = Cache.get("users") || [];
      this.currentUser = Cache.get("currentUser") || null;
    }

    register(userInfo) {
      try {
        if (this.users.find((user) => user.email === userInfo.email)) {
          return { success: false, message: "Email already registered." };
        }
        const newUser = new User({ id: Date.now(), ...userInfo });
        this.users.push(newUser);
        Cache.set("users", this.users);
        this.currentUser = newUser;
        Cache.set("currentUser", this.currentUser);
        return { success: true, user: newUser };
      } catch (error) {
        logError("Registration failed", error);
        return { success: false, message: "Registration error." };
      }
    }

    login(email, password) {
      try {
        const user = this.users.find((user) => user.email === email && user.password === password);
        if (!user) {
          return { success: false, message: "Invalid credentials." };
        }
        this.currentUser = user;
        Cache.set("currentUser", this.currentUser);
        return { success: true, user: user };
      } catch (error) {
        logError("Login failed", error);
        return { success: false, message: "Login error." };
      }
    }

    logout() {
      this.currentUser = null;
      Cache.set("currentUser", null);
    }

    isLoggedIn() {
      return !!this.currentUser;
    }
  }

  // Instantiate UserAuth and expose it
  const userAuth = new UserAuth();
  window.PetAdoptionApp.userAuth = userAuth;

  // ================================
  // Section 5: Form Handlers and Validation
  // ================================

  function handleContactFormSubmit(e) {
    e.preventDefault();
    const name = $("contactName").value.trim();
    const email = $("contactEmail").value.trim();
    const message = $("contactMessage").value.trim();
    const feedback = $("contactFeedback");

    if (!name || !email || !message) {
      feedback.innerHTML = "<div class='alert alert-danger'>All fields are required.</div>";
      return;
    }
    if (!isValidEmail(email)) {
      feedback.innerHTML = "<div class='alert alert-danger'>Please enter a valid email address.</div>";
      return;
    }
    // Simulate API call
    setTimeout(() => {
      feedback.innerHTML = "<div class='alert alert-success'>Message sent successfully. We will contact you soon.</div>";
      $("contactForm").reset();
    }, 500);
  }

  function handleLoginFormSubmit(e) {
    e.preventDefault();
    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value.trim();
    const feedback = $("loginFeedback");

    if (!email || !password) {
      feedback.innerHTML = "<div class='alert alert-danger'>Both email and password are required.</div>";
      return;
    }
    if (!isValidEmail(email)) {
      feedback.innerHTML = "<div class='alert alert-danger'>Invalid email format.</div>";
      return;
    }
    const result = userAuth.login(email, password);
    if (result.success) {
      feedback.innerHTML = "<div class='alert alert-success'>Login successful. Redirecting...</div>";
      $("loginForm").reset();
      setTimeout(() => { $("#loginModal").modal("hide"); }, 1500);
    } else {
      feedback.innerHTML = `<div class='alert alert-danger'>${result.message}</div>`;
    }
  }

  function handleRegisterFormSubmit(e) {
    e.preventDefault();
    const name = $("registerName").value.trim();
    const email = $("registerEmail").value.trim();
    const password = $("registerPassword").value.trim();
    const feedback = $("registerFeedback");

    if (!name || !email || !password) {
      feedback.innerHTML = "<div class='alert alert-danger'>All fields are required for registration.</div>";
      return;
    }
    if (!isValidEmail(email)) {
      feedback.innerHTML = "<div class='alert alert-danger'>Please enter a valid email address.</div>";
      return;
    }
    const result = userAuth.register({ name, email, password });
    if (result.success) {
      feedback.innerHTML = "<div class='alert alert-success'>Registration successful. Welcome!</div>";
      $("registerForm").reset();
      setTimeout(() => { $("#registerModal").modal("hide"); }, 1500);
    } else {
      feedback.innerHTML = `<div class='alert alert-danger'>${result.message}</div>`;
    }
  }

  // ================================
  // Section 6: Analytics and Notifications
  // ================================

  class Analytics {
    static track(eventType, data) {
      console.log("Analytics event:", eventType, data);
      // Simulated API call to analytics service can be placed here.
    }
  }

  class Notifications {
    static show(message, type = "info") {
      const container = $("notificationArea");
      if (container) {
        const notif = createElement("div", { class: `alert alert-${type}` }, message);
        container.appendChild(notif);
        setTimeout(() => {
          container.removeChild(notif);
        }, 3000);
      }
    }
  }

  // ================================
  // Section 7: Offline Caching & Data Fetching
  // ================================

  // Simulated API call to fetch more pets
  function fetchAdditionalPets() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const morePets = [
          new Pet({ id: 9, name: "Bella", species: "Dog", ageGroup: "Adult", image: "dog4.jpg", description: "Friendly and playful dog searching for a family." }),
          new Pet({ id: 10, name: "Milo", species: "Cat", ageGroup: "Puppy/Kitten", image: "cat4.jpg", description: "Curious kitten full of energy." })
        ];
        resolve(morePets);
      }, 1000);
    });
  }

  // Load more pets and update gallery
  function loadMorePets() {
    fetchAdditionalPets().then((morePets) => {
      petGallery.addPets(morePets);
      Analytics.track("LoadMorePets", { count: morePets.length });
    }).catch(error => {
      logError("Fetching additional pets failed", error);
      Notifications.show("Could not load more pets. Please try again later.", "danger");
    });
  }
  window.PetAdoptionApp.loadMorePets = loadMorePets;

  // ================================
  // Section 8: Event Listeners and Initialization
  // ================================

  // Instantiate PetGallery with sample data
  const samplePets = [
    new Pet({ id: 1, name: "Buddy", species: "Dog", ageGroup: "Puppy/Kitten", image: "dog1.jpg", description: "Friendly and energetic dog looking for a loving home." }),
    new Pet({ id: 2, name: "Whiskers", species: "Cat", ageGroup: "Adult", image: "cat1.jpg", description: "Calm and affectionate cat with a gentle nature." }),
    new Pet({ id: 3, name: "Tweety", species: "Bird", ageGroup: "Adult", image: "bird1.jpg", description: "Cheerful bird with vibrant colors." }),
    new Pet({ id: 4, name: "Hopper", species: "Rabbit", ageGroup: "Adult", image: "rabbit1.jpg", description: "Playful rabbit who loves to hop around." }),
    new Pet({ id: 5, name: "Max", species: "Dog", ageGroup: "Adult", image: "dog2.jpg", description: "Loyal and protective dog ready for a new home." }),
    new Pet({ id: 6, name: "Shadow", species: "Cat", ageGroup: "Senior", image: "cat2.jpg", description: "Independent and curious cat seeking a quiet environment." }),
    new Pet({ id: 7, name: "Coco", species: "Dog", ageGroup: "Puppy/Kitten", image: "dog3.jpg", description: "Energetic puppy with a playful spirit." }),
    new Pet({ id: 8, name: "Luna", species: "Cat", ageGroup: "Adult", image: "cat3.jpg", description: "Elegant cat with a mysterious charm." })
  ];
  const petGallery = new PetGallery(samplePets, "petList");
  window.PetAdoptionApp.petGallery = petGallery;

  // Attach event listeners on DOM content loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Render pet gallery
    petGallery.render();

    // Attach search input listener with debounce
    const searchInput = $("searchInput");
    if (searchInput) {
      searchInput.addEventListener("keyup", debounce(() => {
        const species = $("speciesFilter").value;
        const ageGroup = $("ageFilter").value;
        petGallery.filter(searchInput.value, species, ageGroup);
        Analytics.track("Search", { query: searchInput.value });
      }, 300));
    }

    // Attach filter button event
    const filterBtn = $("applyFiltersBtn");
    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        const species = $("speciesFilter").value;
        const ageGroup = $("ageFilter").value;
        petGallery.filter($("searchInput").value, species, ageGroup);
        Analytics.track("FilterApplied", { species, ageGroup });
      });
    }

    // Attach form submissions
    if ($("contactForm")) {
      $("contactForm").addEventListener("submit", handleContactFormSubmit);
    }
    if ($("loginForm")) {
      $("loginForm").addEventListener("submit", handleLoginFormSubmit);
    }
    if ($("registerForm")) {
      $("registerForm").addEventListener("submit", handleRegisterFormSubmit);
    }

    // Analytics: track page view
    Analytics.track("PageView", { page: "Home" });
  });

  // ================================
  // Section 9: Global Handlers and Exports
  // ================================

  // Handle adoption action; can be called inline from HTML buttons
  function handleAdopt(petId) {
    const pet = samplePets.find((p) => p.id === petId);
    if (!pet) {
      Notifications.show("Pet not found.", "danger");
      return;
    }
    if (!pet.available) {
      Notifications.show("Sorry, this pet is no longer available.", "warning");
      return;
    }
    Notifications.show("Thank you for choosing to adopt " + pet.name + "!", "success");
    Analytics.track("AdoptInitiated", { petId: pet.id, petName: pet.name });
    // Additional adoption workflow could be implemented here.
  }
  window.PetAdoptionApp.handleAdopt = handleAdopt;

  // Expose sorting functionality for inline usage
  function sortPetsBy(property) {
    petGallery.sortBy(property);
    Analytics.track("SortApplied", { property });
  }
  window.PetAdoptionApp.sortPetsBy = sortPetsBy;

  // Expose logout functionality
  function logoutUser() {
    userAuth.logout();
    Notifications.show("You have been logged out.", "info");
    Analytics.track("Logout", {});
  }
  window.PetAdoptionApp.logoutUser = logoutUser;

  // ============================================
  // Section 10: Final Initialization and Debug Log
  // ============================================

  console.log("Pet Adoption App JS loaded successfully.");
})();
