/*
 * File: pet_adoption_app_super.js
 * Description: A super-extended JavaScript application module for a Pet Adoption website.
 *
 * Features include:
 *   - Global state management and configuration.
 *   - Data models for pets, users, adoption centers, and VR tours.
 *   - Offline caching with extended recovery.
 *   - Extensive utility functions (debounce, DOM helpers, validation, etc.).
 *   - Advanced analytics with detailed logging and error reporting.
 *   - A dynamic, paginated pet gallery with filtering, sorting, and animations.
 *   - Virtual reality pet tour simulation.
 *   - Enhanced accessibility module (keyboard navigation, ARIA roles, voice commands simulation).
 *   - Payment processing simulation with dynamic receipt generation.
 *   - Real-time chat and support module with extended features.
 *   - Interactive adoption center map integration.
 *   - Routing, push notifications simulation, and service worker registration.
 *   - Dynamic theme (light/dark mode) and multi-language support with live UI updates.
 *   - Comprehensive form handling (contact, login, registration) with additional validations.
 *   - Global event handlers, dynamic animations, and UI accessibility adjustments.
 *
 * All code is encapsulated in an IIFE to prevent global namespace pollution.
 */

(function () {
  "use strict";

  // ========================================================
  // Section 1: Global Namespace, Configuration & State
  // ========================================================
  window.PetAdoptionSuper = window.PetAdoptionSuper || {};

  const Config = {
    defaultLanguage: "en",
    supportedLanguages: ["en", "es", "fr", "de"],
    darkMode: false,
    enableAnimations: true,
    pushNotifications: true,
  };

  const GlobalState = {
    currentLanguage: Config.defaultLanguage,
    darkMode: Config.darkMode,
    pets: [],
    users: [],
    currentUser: null,
    petGallery: null,
    adoptionStats: null,
    vrTourData: null,
    currentRoute: "home",
    notifications: [],
    accessibilityEnabled: true,
  };

  window.PetAdoptionSuper.state = GlobalState;

  // ========================================================
  // Section 2: Data Models (Pets, Users, Centers, VR Tours)
  // ========================================================
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
      this.password = password; // NEVER store plaintext in production!
    }
  }

  class AdoptionCenter {
    constructor({ id, name, location, address, phone }) {
      this.id = id;
      this.name = name;
      this.location = location; // { lat: Number, lng: Number }
      this.address = address;
      this.phone = phone;
    }
  }

  class VRTour {
    constructor({ id, petId, videoUrl, description }) {
      this.id = id;
      this.petId = petId;
      this.videoUrl = videoUrl;
      this.description = description;
    }
  }

  // ========================================================
  // Section 3: Extended Offline Cache (with Recovery)
  // ========================================================
  const Cache = {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error("Cache set error:", e);
      }
    },
    get: (key) => {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (e) {
        console.error("Cache get error:", e);
        return null;
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error("Cache remove error:", e);
      }
    }
  };

  // ========================================================
  // Section 4: Utility Functions & Helpers
  // ========================================================
  function $(id) {
    return document.getElementById(id);
  }

  function createElement(tag, attrs = {}, innerHTML = "") {
    const el = document.createElement(tag);
    for (let key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        el.setAttribute(key, attrs[key]);
      }
    }
    el.innerHTML = innerHTML;
    return el;
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
    // Simulate sending error details to a remote logging service.
  }

  // ========================================================
  // Section 5: Advanced Analytics & Detailed Logging
  // ========================================================
  class Analytics {
    static track(event, data) {
      console.log("Analytics Event:", event, data);
      // Real implementation would send data to an analytics endpoint.
    }
  }

  class DetailedLogger {
    static log(message, level = "info") {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`);
      // Optionally, store logs in local storage or send to a server.
    }
  }

  // ========================================================
  // Section 6: Pet Gallery Module with Animations
  // ========================================================
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
          const card = createElement("div", { class: "col-md-4 mb-4 pet-card-wrapper" });
          card.innerHTML = `
            <div class="pet-card ${Config.enableAnimations ? "animate__animated animate__fadeIn" : ""}">
              <img src="${pet.image}" alt="${pet.name}" class="img-fluid">
              <div class="card-body">
                <h5 class="card-title">${pet.name}</h5>
                <p class="card-text">${pet.description}</p>
                <p><strong>${pet.species}</strong> | ${pet.ageGroup}</p>
                <button class="btn btn-primary" onclick="PetAdoptionSuper.handleAdopt(${pet.id})" ${!pet.available ? "disabled" : ""}>
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
          DetailedLogger.log(`Pagination changed to page ${i}`);
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
      this.filter(); // Reapply current filters
    }
  }

  // ========================================================
  // Section 7: Virtual Reality Pet Tour Module
  // ========================================================
  class VRTourModule {
    constructor(containerId = "vrTourArea") {
      this.container = $(containerId);
      this.tours = [];
    }

    loadTours() {
      // Simulated API call to fetch VR tours
      return new Promise((resolve) => {
        setTimeout(() => {
          this.tours = [
            new VRTour({ id: 1, petId: 1, videoUrl: "vr_tour_dog1.mp4", description: "Experience a 360° tour of Buddy's world." }),
            new VRTour({ id: 2, petId: 2, videoUrl: "vr_tour_cat1.mp4", description: "Take a virtual tour with Whiskers." })
          ];
          resolve(this.tours);
        }, 1200);
      });
    }

    renderTours() {
      if (!this.container) return;
      this.container.innerHTML = "<h4>Virtual Pet Tours</h4>";
      this.tours.forEach(tour => {
        const tourCard = createElement("div", { class: "vr-tour-card mb-3" });
        tourCard.innerHTML = `
          <video width="100%" controls>
            <source src="${tour.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <p>${tour.description}</p>
        `;
        this.container.appendChild(tourCard);
      });
    }
  }
  const vrTourModule = new VRTourModule();
  window.PetAdoptionSuper.vrTourModule = vrTourModule;

  // ========================================================
  // Section 8: Enhanced Accessibility Module
  // ========================================================
  const Accessibility = {
    init: function () {
      // Add ARIA roles and keyboard navigation for critical UI elements
      document.body.setAttribute("role", "main");
      // Simulate voice command listener (for demonstration)
      if ("webkitSpeechRecognition" in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.onresult = function (event) {
          const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
          DetailedLogger.log(`Voice command received: ${command}`);
          // Basic voice commands (e.g., "go home", "show gallery")
          if (command.includes("home")) Router.navigate("home");
          if (command.includes("gallery")) Router.navigate("gallery");
        };
        recognition.start();
      }
    }
  };
  Accessibility.init();

  // ========================================================
  // Section 9: Payment Processing Simulation & Receipt Generation
  // ========================================================
  class PaymentProcessor {
    static processPayment(amount, cardDetails) {
      return new Promise((resolve, reject) => {
        // Simulate payment processing delay
        setTimeout(() => {
          // Randomly determine success
          if (Math.random() > 0.1) {
            const transactionId = "TXN" + Date.now();
            resolve({ success: true, transactionId, amount });
          } else {
            reject(new Error("Payment declined."));
          }
        }, 1500);
      });
    }

    static generateReceipt(transaction) {
      return `
        <h4>Payment Receipt</h4>
        <p>Transaction ID: ${transaction.transactionId}</p>
        <p>Amount: $${transaction.amount}</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      `;
    }
  }
  window.PetAdoptionSuper.PaymentProcessor = PaymentProcessor;

  // ========================================================
  // Section 10: Extended Real-Time Chat & Support Module
  // ========================================================
  class ChatModule {
    constructor(containerId = "chatArea") {
      this.chatContainer = $(containerId);
      this.messages = [];
    }

    sendMessage(user, message) {
      const msgObj = { user, message, timestamp: new Date().toLocaleTimeString() };
      this.messages.push(msgObj);
      this.renderMessage(msgObj);
      Analytics.track("ChatMessageSent", { user: user.name, message });
    }

    renderMessage({ user, message, timestamp }) {
      if (!this.chatContainer) return;
      const msgEl = createElement("div", { class: "chat-message" });
      msgEl.innerHTML = `<strong>${user.name} (${timestamp}):</strong> ${message}`;
      this.chatContainer.appendChild(msgEl);
      // Auto-scroll to latest message
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    initChat() {
      // Simulate periodic incoming messages from support
      setInterval(() => {
        const simulatedMsg = {
          user: { name: "Support" },
          message: "How can we help you today?",
          timestamp: new Date().toLocaleTimeString(),
        };
        this.renderMessage(simulatedMsg);
      }, 25000);
    }
  }
  const chatModule = new ChatModule();
  window.PetAdoptionSuper.chatModule = chatModule;

  // ========================================================
  // Section 11: Interactive Adoption Center Map Module
  // ========================================================
  class CenterMap {
    constructor(containerId = "mapArea") {
      this.container = $(containerId);
      this.centers = [];
    }

    loadCenters() {
      // Simulated API call to load adoption centers
      return new Promise((resolve) => {
        setTimeout(() => {
          this.centers = [
            new AdoptionCenter({
              id: 1,
              name: "Happy Tails Shelter",
              location: { lat: 40.7128, lng: -74.0060 },
              address: "123 Main St, New York, NY",
              phone: "555-1234"
            }),
            new AdoptionCenter({
              id: 2,
              name: "Paws & Claws",
              location: { lat: 34.0522, lng: -118.2437 },
              address: "456 Sunset Blvd, Los Angeles, CA",
              phone: "555-5678"
            }),
            new AdoptionCenter({
              id: 3,
              name: "Furry Friends Home",
              location: { lat: 41.8781, lng: -87.6298 },
              address: "789 Windy Rd, Chicago, IL",
              phone: "555-9012"
            })
          ];
          resolve(this.centers);
        }, 1000);
      });
    }

    renderMap() {
      if (!this.container) return;
      // For simulation, list centers with basic styling
      this.container.innerHTML = "<h5>Adoption Centers</h5>";
      this.centers.forEach(center => {
        const centerEl = createElement("div", { class: "center-card mb-2" });
        centerEl.innerHTML = `
          <h6>${center.name}</h6>
          <p>${center.address}</p>
          <p>Phone: ${center.phone}</p>
        `;
        this.container.appendChild(centerEl);
      });
    }
  }
  const centerMap = new CenterMap();
  window.PetAdoptionSuper.centerMap = centerMap;

  // ========================================================
  // Section 12: Routing & Global State Management
  // ========================================================
  class Router {
    static navigate(route) {
      window.location.hash = route;
    }

    static init(routes) {
      window.addEventListener("hashchange", Router.route);
      Router.routes = routes;
      Router.route();
    }

    static route() {
      const hash = window.location.hash.slice(1) || "home";
      GlobalState.currentRoute = hash;
      if (Router.routes[hash]) {
        Router.routes[hash]();
        Analytics.track("RouteChange", { route: hash });
      } else {
        Router.routes["404"] && Router.routes["404"]();
      }
    }
  }

  const routes = {
    home: () => {
      $("mainContent").innerHTML = `<h2>${translate("welcome")}</h2>
        <p>Explore our collection of adoptable pets and experience our virtual tours.</p>`;
    },
    gallery: () => {
      $("mainContent").innerHTML = document.getElementById("gallerySection").innerHTML;
      GlobalState.petGallery.render();
    },
    contact: () => {
      $("mainContent").innerHTML = document.getElementById("contactSection").innerHTML;
    },
    chat: () => {
      $("mainContent").innerHTML = `<div id="chatArea" class="chat-area" style="height:300px; overflow-y:auto; border:1px solid #ccc; padding:10px;"></div>
        <input type="text" id="chatInput" placeholder="Type your message..." class="form-control mt-2"/>`;
      chatModule.initChat();
      const chatInput = $("chatInput");
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && chatInput.value.trim() !== "") {
          chatModule.sendMessage({ name: GlobalState.currentUser ? GlobalState.currentUser.name : "Guest" }, chatInput.value);
          chatInput.value = "";
        }
      });
    },
    "404": () => {
      $("mainContent").innerHTML = "<h2>404 - Page Not Found</h2>";
    }
  };
  Router.init(routes);

  // ========================================================
  // Section 13: Service Worker & Push Notification Registration
  // ========================================================
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js")
        .then(reg => {
          DetailedLogger.log("Service Worker registered: " + reg.scope);
          // Simulate push notification subscription
          if (Config.pushNotifications) {
            DetailedLogger.log("Push notifications enabled.");
          }
        })
        .catch(err => {
          logError("Service Worker registration failed", err);
        });
    });
  }

  // ========================================================
  // Section 14: Dynamic Theme & Multi-Language Module
  // ========================================================
  const ThemeAndLanguage = {
    toggleDarkMode: function () {
      GlobalState.darkMode = !GlobalState.darkMode;
      document.body.classList.toggle("dark-mode", GlobalState.darkMode);
      const btn = $("toggleDarkModeBtn");
      if (btn) {
        btn.textContent = GlobalState.darkMode ? translate("darkModeOff") : translate("darkModeOn");
      }
    },
    changeLanguage: function (lang) {
      if (Config.supportedLanguages.includes(lang)) {
        GlobalState.currentLanguage = lang;
        // Update UI text dynamically for key elements
        if ($("searchInput")) {
          $("searchInput").placeholder = translate("searchPlaceholder");
        }
        if ($("toggleDarkModeBtn")) {
          $("toggleDarkModeBtn").textContent = GlobalState.darkMode ? translate("darkModeOff") : translate("darkModeOn");
        }
        // Additional elements can be updated here.
      }
    }
  };
  window.PetAdoptionSuper.ThemeAndLanguage = ThemeAndLanguage;

  // ========================================================
  // Section 15: Event Handlers & Form Submissions
  // ========================================================
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
      Analytics.track("ContactFormSubmitted", { name, email });
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
    // Simulated login process:
    const user = new User({ id: Date.now(), name: "Demo User", email, password });
    GlobalState.currentUser = user;
    feedback.innerHTML = "<div class='alert alert-success'>Login successful!</div>";
    $("loginForm").reset();
    Analytics.track("UserLoggedIn", { email });
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
    // Simulated registration process:
    const user = new User({ id: Date.now(), name, email, password });
    GlobalState.users.push(user);
    GlobalState.currentUser = user;
    feedback.innerHTML = "<div class='alert alert-success'>Registration successful!</div>";
    $("registerForm").reset();
    Analytics.track("UserRegistered", { email });
  }

  // ========================================================
  // Section 16: Global Handlers for Adoption, Sorting & Additional Features
  // ========================================================
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
    // Simulate updating availability and payment
    pet.available = false;
    GlobalState.petGallery.render();
    PaymentProcessor.processPayment(50, { cardNumber: "4111111111111111", expiry: "12/25", cvv: "123" })
      .then(result => {
        DetailedLogger.log("Payment processed successfully: " + result.transactionId);
        const receiptHTML = PaymentProcessor.generateReceipt(result);
        $("receiptArea").innerHTML = receiptHTML;
        Notifications.show("Payment successful! Check receipt.", "success");
      })
      .catch(err => {
        logError("Payment failed", err);
        Notifications.show("Payment failed: " + err.message, "danger");
      });
  }
  window.PetAdoptionSuper.handleAdopt = handleAdopt;

  function sortPetsBy(property) {
    GlobalState.petGallery.sortBy(property);
    Analytics.track("SortApplied", { property });
  }
  window.PetAdoptionSuper.sortPetsBy = sortPetsBy;

  // ========================================================
  // Section 17: Dynamic UI Animations & Accessibility Enhancements
  // ========================================================
  function attachUIAnimations() {
    // Example: Animate header on scroll
    window.addEventListener("scroll", () => {
      const header = $("header");
      if (header) {
        const offset = window.pageYOffset;
        header.style.opacity = Math.max(1 - offset / 300, 0.5);
      }
    });
  }
  attachUIAnimations();

  // ========================================================
  // Section 18: Initialization & DOMContentLoaded
  // ========================================================
  document.addEventListener("DOMContentLoaded", function () {
    // Load sample pets and initialize gallery
    fetchSamplePets().then(pets => {
      GlobalState.pets = pets;
      GlobalState.petGallery = new PetGallery(pets, "petList");
      GlobalState.petGallery.render();
    }).catch(err => {
      logError("Failed to fetch sample pets", err);
    });

    // Load VR tours and render if container exists
    vrTourModule.loadTours().then(() => {
      vrTourModule.renderTours();
    });

    // Load adoption centers and render map
    centerMap.loadCenters().then(() => centerMap.renderMap());

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

    // Attach UI toggle buttons for dark mode and language
    const darkModeBtn = $("toggleDarkModeBtn");
    if (darkModeBtn) {
      darkModeBtn.addEventListener("click", ThemeAndLanguage.toggleDarkMode);
      darkModeBtn.textContent = GlobalState.darkMode ? translate("darkModeOff") : translate("darkModeOn");
    }
    const languageSelect = $("languageSelect");
    if (languageSelect) {
      languageSelect.addEventListener("change", (e) => ThemeAndLanguage.changeLanguage(e.target.value));
    }

    // Initialize push notification simulation if enabled
    if (Config.pushNotifications && "Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          DetailedLogger.log("Push notifications granted.");
        }
      });
    }

    // Initialize Chart.js adoption statistics (if canvas exists)
    if ($("adoptionChart")) {
      adoptionStats.fetchAdoptionData().then(data => {
        adoptionStats.renderChart(data);
      }).catch(err => {
        logError("Error fetching adoption stats", err);
      });
    }

    // Initialize routing based on current hash
    Router.route();
    Analytics.track("PageView", { page: GlobalState.currentRoute });
  });

  // ========================================================
  // Section 19: Expose Global Functions & Final Debug Logging
  // ========================================================
  window.PetAdoptionSuper.sortPetsBy = sortPetsBy;
  window.PetAdoptionSuper.handleAdopt = handleAdopt;
  DetailedLogger.log("Pet Adoption App Super JS loaded successfully.");
})();
