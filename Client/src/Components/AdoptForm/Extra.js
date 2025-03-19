/*
 * File: pet_adoption_frontend_extra.js
 * Description: An extensive JavaScript frontend module for a Pet Adoption Website.
 * This module includes:
 *   - Global state management and configuration settings.
 *   - Data models for pets and users.
 *   - Utility functions (debounce, DOM helpers, validation, etc.).
 *   - Dynamic rendering of pet galleries with filtering, sorting, and pagination.
 *   - Dark mode toggling and multi-language support.
 *   - User settings management.
 *   - Advanced data visualization (adoption statistics via Chart.js).
 *   - Simulated API calls and error logging.
 *   - Event listeners and initialization.
 *
 * All code is wrapped in an IIFE to prevent global namespace pollution.
 */

(function () {
  "use strict";

  // ================================
  // Section 1: Global Configuration & State
  // ================================
  window.PetAdoptionExtra = window.PetAdoptionExtra || {};

  const Config = {
    defaultLanguage: "en",
    supportedLanguages: ["en", "es", "fr"],
    darkMode: false,
  };

  const GlobalState = {
    currentLanguage: Config.defaultLanguage,
    darkMode: Config.darkMode,
    pets: [],
    users: [],
    currentUser: null,
    petGallery: null,
    adoptionStats: null,
  };

  window.PetAdoptionExtra.state = GlobalState;

  // ================================
  // Section 2: Data Models
  // ================================
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

  class User {
    constructor({ id, name, email, password }) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password; // Note: Never store plaintext in production!
    }
  }

  // ================================
  // Section 3: Utility Functions & Helpers
  // ================================
  function $(id) {
    return document.getElementById(id);
  }

  function createElement(tag, attrs = {}, innerHTML = "") {
    const elem = document.createElement(tag);
    for (const key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        elem.setAttribute(key, attrs[key]);
      }
    }
    elem.innerHTML = innerHTML;
    return elem;
  }

  function debounce(func, delay) {
    let timer;
    return function () {
      const context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(context, args), delay);
    };
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function logError(message, error) {
    console.error("Error:", message, error);
    // Simulate sending error info to a remote logging service.
  }

  // Language translation dictionary (sample)
  const Translations = {
    en: {
      welcome: "Welcome to the Pet Adoption Portal",
      adopt: "Adopt",
      notAvailable: "Not Available",
      searchPlaceholder: "Search pets by name...",
      filterButton: "Apply Filters",
      noPetsFound: "No pets found.",
      darkModeOn: "Switch to Dark Mode",
      darkModeOff: "Switch to Light Mode",
    },
    es: {
      welcome: "Bienvenido al Portal de Adopción de Mascotas",
      adopt: "Adoptar",
      notAvailable: "No Disponible",
      searchPlaceholder: "Buscar mascotas por nombre...",
      filterButton: "Aplicar Filtros",
      noPetsFound: "No se encontraron mascotas.",
      darkModeOn: "Cambiar a Modo Oscuro",
      darkModeOff: "Cambiar a Modo Claro",
    },
    fr: {
      welcome: "Bienvenue sur le Portail d'Adoption d'Animaux",
      adopt: "Adopter",
      notAvailable: "Indisponible",
      searchPlaceholder: "Rechercher des animaux par nom...",
      filterButton: "Appliquer les Filtres",
      noPetsFound: "Aucun animal trouvé.",
      darkModeOn: "Passer en mode sombre",
      darkModeOff: "Passer en mode clair",
    }
  };

  function translate(key) {
    const lang = GlobalState.currentLanguage;
    return Translations[lang] && Translations[lang][key] ? Translations[lang][key] : key;
  }

  // ================================
  // Section 4: Pet Gallery Module
  // ================================
  class PetGallery {
    constructor(pets = [], containerId = "petList") {
      this.allPets = pets;
      this.filteredPets = [...pets];
      this.container = $(containerId);
      this.currentPage = 1;
      this.petsPerPage = 6;
    }

    render() {
      try {
        if (!this.container) return;
        this.container.innerHTML = "";
        const start = (this.currentPage - 1) * this.petsPerPage;
        const currentPets = this.filteredPets.slice(start, start + this.petsPerPage);
        if (currentPets.length === 0) {
          this.container.innerHTML = `<div class='col-12 text-center'><p>${translate("noPetsFound")}</p></div>`;
          return;
        }
        currentPets.forEach(pet => {
          const card = createElement("div", { class: "col-md-4 mb-4" });
          card.innerHTML = `
            <div class="pet-card">
              <img src="${pet.image}" alt="${pet.name}" class="img-fluid">
              <div class="card-body">
                <h5 class="card-title">${pet.name}</h5>
                <p class="card-text">${pet.description}</p>
                <p><strong>${pet.species}</strong> | ${pet.ageGroup}</p>
                <button class="btn btn-primary" onclick="PetAdoptionExtra.handleAdopt(${pet.id})" ${!pet.available ? "disabled" : ""}>
                  ${pet.available ? translate("adopt") : translate("notAvailable")}
                </button>
              </div>
            </div>
          `;
          this.container.appendChild(card);
        });
        this.renderPagination();
      } catch (error) {
        logError("Error rendering pet gallery", error);
      }
    }

    renderPagination() {
      const pagination = $("paginationControls");
      if (!pagination) return;
      pagination.innerHTML = "";
      const totalPages = Math.ceil(this.filteredPets.length / this.petsPerPage);
      for (let i = 1; i <= totalPages; i++) {
        const btn = createElement("button", { class: "btn btn-secondary mx-1", "data-page": i }, i);
        if (i === this.currentPage) btn.disabled = true;
        btn.addEventListener("click", () => {
          this.currentPage = i;
          this.render();
        });
        pagination.appendChild(btn);
      }
    }

    filter(searchText = "", species = "", ageGroup = "") {
      const query = searchText.toLowerCase();
      this.filteredPets = this.allPets.filter(pet => {
        const matchesName = pet.name.toLowerCase().includes(query);
        const matchesSpecies = species === "" || pet.species === species;
        const matchesAge = ageGroup === "" || pet.ageGroup === ageGroup;
        return matchesName && matchesSpecies && matchesAge;
      });
      this.currentPage = 1;
      this.render();
    }

    sortBy(prop) {
      this.filteredPets.sort((a, b) => (a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : 0));
      this.render();
    }

    addPets(newPets) {
      this.allPets = this.allPets.concat(newPets);
      this.filter(); // Reapply filters
    }
  }

  // ================================
  // Section 5: User Settings & Preferences
  // ================================
  const UserSettings = {
    toggleDarkMode: function () {
      GlobalState.darkMode = !GlobalState.darkMode;
      document.body.classList.toggle("dark-mode", GlobalState.darkMode);
      const btn = $("toggleDarkModeBtn");
      if (btn) {
        btn.textContent = GlobalState.darkMode ? translate("darkModeOff") : translate("darkModeOn");
      }
      // Optionally, save to localStorage.
    },

    changeLanguage: function (lang) {
      if (Config.supportedLanguages.includes(lang)) {
        GlobalState.currentLanguage = lang;
        // Update UI text for dynamic elements.
        if ($("searchInput")) {
          $("searchInput").placeholder = translate("searchPlaceholder");
        }
        if ($("toggleDarkModeBtn")) {
          $("toggleDarkModeBtn").textContent = GlobalState.darkMode ? translate("darkModeOff") : translate("darkModeOn");
        }
        // Additional translation updates can be triggered here.
      }
    }
  };
  window.PetAdoptionExtra.UserSettings = UserSettings;

  // ================================
  // Section 6: Advanced Data Visualization (Chart.js Integration)
  // ================================
  class AdoptionStats {
    constructor(canvasId = "adoptionChart") {
      this.canvas = $(canvasId);
      this.chart = null;
    }

    renderChart(data) {
      if (!this.canvas) return;
      // Assume Chart.js is loaded in the HTML.
      const ctx = this.canvas.getContext("2d");
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: [{
            label: "Number of Adoptions",
            data: data.values,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: { beginAtZero: true }
            }]
          }
        }
      });
    },

    fetchAdoptionData: function () {
      // Simulated API call to fetch adoption statistics
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            labels: ["Dog", "Cat", "Bird", "Rabbit"],
            values: [120, 90, 40, 25]
          });
        }, 1000);
      });
    }
  }
  const adoptionStats = new AdoptionStats();
  GlobalState.adoptionStats = adoptionStats;
  window.PetAdoptionExtra.adoptionStats = adoptionStats;

  // ================================
  // Section 7: Simulated API Interactions & Data Fetching
  // ================================
  function fetchSamplePets() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          new Pet({ id: 1, name: "Buddy", species: "Dog", ageGroup: "Puppy/Kitten", image: "dog1.jpg", description: "Friendly and energetic." }),
          new Pet({ id: 2, name: "Whiskers", species: "Cat", ageGroup: "Adult", image: "cat1.jpg", description: "Calm and affectionate." }),
          new Pet({ id: 3, name: "Tweety", species: "Bird", ageGroup: "Adult", image: "bird1.jpg", description: "Cheerful and vibrant." }),
          new Pet({ id: 4, name: "Hopper", species: "Rabbit", ageGroup: "Adult", image: "rabbit1.jpg", description: "Playful and bouncy." }),
          new Pet({ id: 5, name: "Max", species: "Dog", ageGroup: "Adult", image: "dog2.jpg", description: "Loyal and protective." }),
          new Pet({ id: 6, name: "Shadow", species: "Cat", ageGroup: "Senior", image: "cat2.jpg", description: "Independent and curious." }),
          new Pet({ id: 7, name: "Coco", species: "Dog", ageGroup: "Puppy/Kitten", image: "dog3.jpg", description: "Energetic and playful." }),
          new Pet({ id: 8, name: "Luna", species: "Cat", ageGroup: "Adult", image: "cat3.jpg", description: "Elegant and mysterious." })
        ]);
      }, 1000);
    });
  }

  // ================================
  // Section 8: Event Handlers & Form Submissions
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
      feedback.innerHTML = "<div class='alert alert-danger'>Please enter a valid email.</div>";
      return;
    }
    setTimeout(() => {
      feedback.innerHTML = "<div class='alert alert-success'>Message sent successfully!</div>";
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
    // Simulated login process
    const user = new User({ id: Date.now(), name: "Demo User", email, password });
    GlobalState.currentUser = user;
    feedback.innerHTML = "<div class='alert alert-success'>Login successful!</div>";
    $("loginForm").reset();
  }

  function handleRegisterFormSubmit(e) {
    e.preventDefault();
    const name = $("registerName").value.trim();
    const email = $("registerEmail").value.trim();
    const password = $("registerPassword").value.trim();
    const feedback = $("registerFeedback");

    if (!name || !email || !password) {
      feedback.innerHTML = "<div class='alert alert-danger'>All fields are required.</div>";
      return;
    }
    if (!isValidEmail(email)) {
      feedback.innerHTML = "<div class='alert alert-danger'>Invalid email.</div>";
      return;
    }
    // Simulated registration process
    const user = new User({ id: Date.now(), name, email, password });
    GlobalState.users.push(user);
    GlobalState.currentUser = user;
    feedback.innerHTML = "<div class='alert alert-success'>Registration successful!</div>";
    $("registerForm").reset();
  }

  // ================================
  // Section 9: Global Handlers for Adoption & Sorting
  // ================================
  function handleAdopt(petId) {
    const pet = GlobalState.pets.find(p => p.id === petId);
    if (!pet) {
      alert("Pet not found.");
      return;
    }
    if (!pet.available) {
      alert("Sorry, this pet is not available.");
      return;
    }
    alert("Thank you for choosing to adopt " + pet.name + "!");
    // Simulate updating availability
    pet.available = false;
    GlobalState.petGallery.render();
  }
  window.PetAdoptionExtra.handleAdopt = handleAdopt;

  function sortPetsBy(property) {
    GlobalState.petGallery.sortBy(property);
  }
  window.PetAdoptionExtra.sortPetsBy = sortPetsBy;

  // ================================
  // Section 10: Dark Mode & Language Toggle Buttons
  // ================================
  function attachToggleButtons() {
    const darkModeBtn = $("toggleDarkModeBtn");
    if (darkModeBtn) {
      darkModeBtn.textContent = GlobalState.darkMode ? translate("darkModeOff") : translate("darkModeOn");
      darkModeBtn.addEventListener("click", UserSettings.toggleDarkMode);
    }
    const languageSelect = $("languageSelect");
    if (languageSelect) {
      languageSelect.addEventListener("change", (e) => {
        UserSettings.changeLanguage(e.target.value);
      });
    }
  }

  // ================================
  // Section 11: Initialization & DOMContentLoaded
  // ================================
  document.addEventListener("DOMContentLoaded", function () {
    // Load sample pets and initialize gallery
    fetchSamplePets().then(pets => {
      GlobalState.pets = pets;
      GlobalState.petGallery = new PetGallery(pets, "petList");
      GlobalState.petGallery.render();
    }).catch(err => {
      logError("Failed to fetch sample pets", err);
    });

    // Attach form event listeners
    if ($("contactForm")) $("contactForm").addEventListener("submit", handleContactFormSubmit);
    if ($("loginForm")) $("loginForm").addEventListener("submit", handleLoginFormSubmit);
    if ($("registerForm")) $("registerForm").addEventListener("submit", handleRegisterFormSubmit);

    // Attach search input event listener with debounce
    if ($("searchInput")) {
      $("searchInput").placeholder = translate("searchPlaceholder");
      $("searchInput").addEventListener("keyup", debounce(() => {
        const species = $("speciesFilter").value;
        const ageGroup = $("ageFilter").value;
        GlobalState.petGallery.filter($("searchInput").value, species, ageGroup);
      }, 300));
    }

    // Attach toggle buttons
    attachToggleButtons();

    // Render adoption statistics chart after fetching data
    adoptionStats.fetchAdoptionData().then(data => {
      adoptionStats.renderChart(data);
    }).catch(err => {
      logError("Error fetching adoption stats", err);
    });
  });

  // ================================
  // Section 12: Expose Global Functions
  // ================================
  window.PetAdoptionExtra.sortPetsBy = sortPetsBy;
  window.PetAdoptionExtra.handleAdopt = handleAdopt;

  console.log("Pet Adoption Frontend Extra JS loaded successfully.");
})();
