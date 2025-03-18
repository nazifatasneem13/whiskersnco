/*
 * File: pet_adoption_app_full.js
 * Description: An all-inclusive JavaScript application module for a Pet Adoption website.
 * Features include:
 *   - Data models for pets, users, and adoption centers.
 *   - A dynamic, paginated pet gallery with advanced filtering, sorting, and search.
 *   - User authentication, session management, and secure form handling.
 *   - Advanced analytics, notifications, and error logging.
 *   - Simulated API interactions for fetching pets, payment processing, and real-time chat.
 *   - Interactive adoption center map integration using a mapping API simulation.
 *   - Payment processing simulation for adoption fees.
 *   - Real-time chat support simulation.
 *   - Routing and global state management.
 *   - Service Worker registration for offline caching.
 *
 * All code is encapsulated within an IIFE to avoid polluting the global namespace.
 */

(function () {
  "use strict";

  // ================================
  // Section 1: Global Namespace & State
  // ================================

  window.PetAdoptionApp = window.PetAdoptionApp || {};
  const GlobalState = {
    currentView: "home", // 'home', 'gallery', 'contact', 'chat', etc.
    user: null,
    pets: [],
    centers: [],
    notifications: [],
  };
  window.PetAdoptionApp.state = GlobalState;

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

  // ================================
  // Section 3: Offline Cache (LocalStorage Wrapper)
  // ================================

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
  };

  // ================================
  // Section 4: Utility Functions
  // ================================

  function $(id) {
    return document.getElementById(id);
  }

  function createElement(tag, attrs = {}, innerHTML = "") {
    const el = document.createElement(tag);
    for (let key in attrs) {
      if (attrs.hasOwnProperty(key)) {
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
    // Simulate remote logging
    // e.g., send error data to a logging service endpoint
  }

  // ================================
  // Section 5: Advanced Analytics & Notifications
  // ================================

  class Analytics {
    static track(event, data) {
      console.log("Analytics:", event, data);
      // Real implementation would send data to an analytics endpoint
    }
  }

  class Notifications {
    static show(message, type = "info", duration = 4000) {
      const container = $("notificationArea");
      if (!container) return;
      const notif = createElement("div", { class: `alert alert-${type}` }, message);
      container.appendChild(notif);
      setTimeout(() => {
        container.removeChild(notif);
      }, duration);
    }
  }

  // ================================
  // Section 6: Pet Gallery Module
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
          this.container.innerHTML = "<div class='col-12 text-center'><p>No pets found.</p></div>";
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
                <p><strong>Species:</strong> ${pet.species} | <strong>Age:</strong> ${pet.ageGroup}</p>
                <button class="btn btn-primary" onclick="PetAdoptionApp.handleAdopt(${pet.id})" ${!pet.available ? "disabled" : ""}>
                  ${pet.available ? "Adopt" : "Not Available"}
                </button>
              </div>
            </div>
          `;
          this.container.appendChild(card);
        });
        this.renderPagination();
      } catch (error) {
        logError("Error rendering gallery", error);
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
      this.filter(); // reapply current filters
    }
  }

  // ================================
  // Section 7: User Authentication Module
  // ================================

  class UserAuth {
    constructor() {
      this.users = Cache.get("users") || [];
      this.currentUser = Cache.get("currentUser") || null;
    }

    register({ name, email, password }) {
      if (this.users.find(user => user.email === email)) {
        return { success: false, message: "Email is already registered." };
      }
      const newUser = new User({ id: Date.now(), name, email, password });
      this.users.push(newUser);
      Cache.set("users", this.users);
      this.currentUser = newUser;
      Cache.set("currentUser", this.currentUser);
      return { success: true, user: newUser };
    }

    login(email, password) {
      const user = this.users.find(user => user.email === email && user.password === password);
      if (!user) return { success: false, message: "Invalid credentials." };
      this.currentUser = user;
      Cache.set("currentUser", this.currentUser);
      return { success: true, user };
    }

    logout() {
      this.currentUser = null;
      Cache.set("currentUser", null);
    }

    isLoggedIn() {
      return !!this.currentUser;
    }
  }

  const userAuth = new UserAuth();
  window.PetAdoptionApp.userAuth = userAuth;

  // ================================
  // Section 8: Payment Processing Simulation
  // ================================

  class PaymentProcessor {
    static processPayment(amount, cardDetails) {
      return new Promise((resolve, reject) => {
        // Simulate payment processing delay
        setTimeout(() => {
          // Randomly decide if payment is successful
          if (Math.random() > 0.1) {
            resolve({ success: true, transactionId: "TXN" + Date.now() });
          } else {
            reject(new Error("Payment declined."));
          }
        }, 1500);
      });
    }
  }

  window.PetAdoptionApp.PaymentProcessor = PaymentProcessor;

  // ================================
  // Section 9: Real-time Chat Module Simulation
  // ================================

  class ChatModule {
    constructor(chatContainerId = "chatArea") {
      this.chatContainer = $(chatContainerId);
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
      // Simulate receiving messages from other users
      setInterval(() => {
        const simulatedMsg = {
          user: { name: "Support" },
          message: "How can we assist you today?",
          timestamp: new Date().toLocaleTimeString(),
        };
        this.renderMessage(simulatedMsg);
      }, 20000);
    }
  }

  const chatModule = new ChatModule();
  window.PetAdoptionApp.chatModule = chatModule;

  // ================================
  // Section 10: Adoption Center Map Integration (Simulated)
  // ================================

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
              phone: "555-1234",
            }),
            new AdoptionCenter({
              id: 2,
              name: "Paws & Claws",
              location: { lat: 34.0522, lng: -118.2437 },
              address: "456 Sunset Blvd, Los Angeles, CA",
              phone: "555-5678",
            }),
          ];
          resolve(this.centers);
        }, 1000);
      });
    }

    renderMap() {
      if (!this.container) return;
      // For simulation, simply list the centers
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
  window.PetAdoptionApp.centerMap = centerMap;

  // ================================
  // Section 11: Routing and Global State Management
  // ================================

  class Router {
    constructor(routes) {
      this.routes = routes;
      window.addEventListener("hashchange", this.route.bind(this));
      this.route();
    }

    route() {
      const hash = window.location.hash.slice(1) || "home";
      GlobalState.currentView = hash;
      if (this.routes[hash]) {
        this.routes[hash]();
        Analytics.track("RouteChange", { route: hash });
      } else {
        this.routes["404"] && this.routes["404"]();
      }
    }
  }

  // Define basic routes
  const routes = {
    home: () => {
      $("mainContent").innerHTML = "<h2>Welcome to the Pet Adoption Portal</h2><p>Find your new best friend today!</p>";
    },
    gallery: () => {
      $("mainContent").innerHTML = document.getElementById("gallerySection").innerHTML;
      GlobalState.petGallery.render();
    },
    contact: () => {
      $("mainContent").innerHTML = document.getElementById("contactSection").innerHTML;
    },
    chat: () => {
      $("mainContent").innerHTML = "<div id='chatArea' class='chat-area' style='height:300px; overflow-y:auto; border:1px solid #ccc; padding:10px;'></div>" +
        "<input type='text' id='chatInput' placeholder='Type your message...' class='form-control mt-2'/>";
      chatModule.initChat();
      const chatInput = $("chatInput");
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && chatInput.value.trim() !== "") {
          chatModule.sendMessage({ name: userAuth.currentUser ? userAuth.currentUser.name : "Guest" }, chatInput.value);
          chatInput.value = "";
        }
      });
    },
    "404": () => {
      $("mainContent").innerHTML = "<h2>404 - Page Not Found</h2>";
    }
  };

  new Router(routes);

  // ================================
  // Section 12: Service Worker Registration for Offline Support
  // ================================

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js")
        .then(reg => console.log("Service Worker registered:", reg.scope))
        .catch(err => console.error("Service Worker registration failed:", err));
    });
  }

  // ================================
  // Section 13: Form Handlers and Event Listeners
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
    setTimeout(() => {
      feedback.innerHTML = "<div class='alert alert-success'>Message sent. We will contact you soon.</div>";
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
      feedback.innerHTML = "<div class='alert alert-danger'>Email and password are required.</div>";
      return;
    }
    if (!isValidEmail(email)) {
      feedback.innerHTML = "<div class='alert alert-danger'>Invalid email format.</div>";
      return;
    }
    const result = userAuth.login(email, password);
    if (result.success) {
      feedback.innerHTML = "<div class='alert alert-success'>Login successful.</div>";
      $("loginForm").reset();
      Analytics.track("UserLoggedIn", { email });
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
      feedback.innerHTML = "<div class='alert alert-danger'>Enter a valid email.</div>";
      return;
    }
    const result = userAuth.register({ name, email, password });
    if (result.success) {
      feedback.innerHTML = "<div class='alert alert-success'>Registration successful!</div>";
      $("registerForm").reset();
      Analytics.track("UserRegistered", { email });
      setTimeout(() => { $("#registerModal").modal("hide"); }, 1500);
    } else {
      feedback.innerHTML = `<div class='alert alert-danger'>${result.message}</div>`;
    }
  }

  // ================================
  // Section 14: Global Handlers for Adoption & Sorting
  // ================================

  function handleAdopt(petId) {
    const pet = GlobalState.pets.find(p => p.id === petId);
    if (!pet) {
      Notifications.show("Pet not found.", "danger");
      return;
    }
    if (!pet.available) {
      Notifications.show("This pet is no longer available.", "warning");
      return;
    }
    Notifications.show("Thank you for choosing to adopt " + pet.name + "!", "success");
    Analytics.track("AdoptInitiated", { petId: pet.id, petName: pet.name });
    // Simulate payment for adoption fee
    PaymentProcessor.processPayment(50, { cardNumber: "4111111111111111", expiry: "12/25", cvv: "123" })
      .then(result => {
        Notifications.show("Payment successful! Transaction ID: " + result.transactionId, "success");
      })
      .catch(err => {
        logError("Payment processing failed", err);
        Notifications.show("Payment failed: " + err.message, "danger");
      });
  }
  window.PetAdoptionApp.handleAdopt = handleAdopt;

  function sortPetsBy(property) {
    GlobalState.petGallery.sortBy(property);
    Analytics.track("SortApplied", { property });
  }
  window.PetAdoptionApp.sortPetsBy = sortPetsBy;

  function logoutUser() {
    userAuth.logout();
    Notifications.show("Logged out successfully.", "info");
    Analytics.track("UserLoggedOut", {});
  }
  window.PetAdoptionApp.logoutUser = logoutUser;

  // ================================
  // Section 15: Initialization and DOMContentLoaded
  // ================================

  document.addEventListener("DOMContentLoaded", function () {
    // Instantiate pet gallery with sample pets
    const samplePets = [
      new Pet({ id: 1, name: "Buddy", species: "Dog", ageGroup: "Puppy/Kitten", image: "dog1.jpg", description: "Friendly and energetic." }),
      new Pet({ id: 2, name: "Whiskers", species: "Cat", ageGroup: "Adult", image: "cat1.jpg", description: "Calm and affectionate." }),
      new Pet({ id: 3, name: "Tweety", species: "Bird", ageGroup: "Adult", image: "bird1.jpg", description: "Cheerful and vibrant." }),
      new Pet({ id: 4, name: "Hopper", species: "Rabbit", ageGroup: "Adult", image: "rabbit1.jpg", description: "Playful and bouncy." }),
      new Pet({ id: 5, name: "Max", species: "Dog", ageGroup: "Adult", image: "dog2.jpg", description: "Loyal and protective." }),
      new Pet({ id: 6, name: "Shadow", species: "Cat", ageGroup: "Senior", image: "cat2.jpg", description: "Independent and curious." }),
      new Pet({ id: 7, name: "Coco", species: "Dog", ageGroup: "Puppy/Kitten", image: "dog3.jpg", description: "Energetic and playful." }),
      new Pet({ id: 8, name: "Luna", species: "Cat", ageGroup: "Adult", image: "cat3.jpg", description: "Elegant and mysterious." })
    ];
    GlobalState.pets = samplePets;
    GlobalState.petGallery = new PetGallery(samplePets, "petList");
    GlobalState.petGallery.render();

    // Attach event listeners for filtering & search
    if ($("searchInput")) {
      $("searchInput").addEventListener("keyup", debounce(() => {
        const species = $("speciesFilter").value;
        const ageGroup = $("ageFilter").value;
        GlobalState.petGallery.filter($("searchInput").value, species, ageGroup);
        Analytics.track("Search", { query: $("searchInput").value });
      }, 300));
    }
    if ($("applyFiltersBtn")) {
      $("applyFiltersBtn").addEventListener("click", () => {
        const species = $("speciesFilter").value;
        const ageGroup = $("ageFilter").value;
        GlobalState.petGallery.filter($("searchInput").value, species, ageGroup);
        Analytics.track("FilterApplied", { species, ageGroup });
      });
    }

    // Attach form submissions
    if ($("contactForm")) $("contactForm").addEventListener("submit", handleContactFormSubmit);
    if ($("loginForm")) $("loginForm").addEventListener("submit", handleLoginFormSubmit);
    if ($("registerForm")) $("registerForm").addEventListener("submit", handleRegisterFormSubmit);

    // Load adoption centers and render map
    centerMap.loadCenters().then(() => centerMap.renderMap());

    // Analytics: Track page view
    Analytics.track("PageView", { page: GlobalState.currentView });
  });

  // ================================
  // Section 16: Final Debug and Exports
  // ================================

  console.log("Pet Adoption App Full JS loaded successfully.");
})();
