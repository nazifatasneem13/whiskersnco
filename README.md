# Whiskers & Co. 🐾  
**A Pet Adoption Platform**  

---



## 🚀 Project Description  
**Whiskers & Co.** revolutionizes pet adoption by bridging adopters, shelters, and pet owners through a seamless digital platform. It eliminates fragmented workflows with features like AI-powered pet recognition, real-time communication, and automated adoption tracking. Designed to reduce abandoned pets and enhance transparency in adoptions.  

**Live Demo:** 🌐 [https://wnco.onrender.com/](https://wnco.onrender.com/)  

---

## ✨ Key Features  

### 🔒 **Authentication & Security**  
- **Secure Registration/Login**: Bcrypt password hashing + JWT token authentication.  
- **Google OAuth**: One-click sign-in via Google accounts.  

### 🐕 **Adoption Workflow**  
- **Adoption Forms**: Submit forms with pet preferences, living conditions, and experience.  
- **Real-Time Chat**: Direct messaging between adopters and pet owners.  
- **Admin Dashboard**: Approve/reject pet listings and adoption requests.  

### 🤖 **AI & Machine Learning**  
- **Pet Type/Breed Prediction**: Upload images to classify pets (e.g., Dog, Cat) and predict breeds.  
- **Training Guide Generation**: Auto-generate guides using Groq’s language models.  

### 🎯 **User-Centric Tools**  
- **Dynamic Carousel**: Infinite-scroll recommendations based on user preferences.  
- **Wishlist**: Save favorite pets for later adoption.  
- **Nearby Vet Search**: Locate vets via OpenStreetMap integration.  

### 📢 **Notifications & News**  
- **Real-Time Alerts**: Notify users for messages, adoption updates, or blocked users.  
- **Pet News Feed**: Fetch articles via NewsAPI.  

### 👩💻 **Admin Features**  
- Manage incoming requests (pets/adoptions).  
- Track adopted pets and user activity history.  

---

## 💻 Technologies & Tools  
| **Category**       | **Tools**                                                                 |  
|---------------------|--------------------------------------------------------------------------|  
| **Frontend**        | React, CSS Animations                                                   |  
| **Backend**         | Node.js, Express                                                        |  
| **Database**        | MongoDB (Mongoose)                                                      |  
| **Authentication**  | JWT, Google OAuth, Bcrypt                                               |  
| **AI/ML**           | TensorFlow.js, Groq API                                                 |  
| **Cloud Storage**   | Cloudinary (image/video uploads)                                        |  
| **APIs**            | NewsAPI, OpenStreetMap, Firebase (chat)                                 |  
| **Dev Tools**       | VS Code, GitHub, Postman                                                |  

---

## 🔌 APIs Integrated  
- **NewsAPI**: Fetch pet-related news articles.  
- **OpenStreetMap**: Geolocation-based vet search.  
- **Groq API**: Generate training guides using LLMs.  
- **Cloudinary**: Store and manage pet images/videos.  
- **Firebase**: Real-time chat functionality.  

---

## ⚙️ Installation Guide  
## **Clone the repository**:  
   ```bash  
   git clone https://github.com/nazifatasneem13/whiskersnco.git
   ```
## **Install dependencies**:

 ```bash  
cd whiskers-and-co  
npm install
```  
## **Configure environment variables**:
 Create a .env file with:
```bash  
MONGODB_URI=your_mongodb_uri  
CLOUDINARY_CLOUD_NAME=your_cloud_name  
NEWSAPI_KEY=your_newsapi_key  
GROQ_API_KEY=your_groq_key  
Run the application:
```

 ```bash  
npm run dev
```  
## 🚀 Deployment
The project is deployed on Render:
🔗 https://wnco.onrender.com/

## 🎮 Usage Guide
-Sign Up/Log In:

Register using email/password or Google OAuth.

- Browse Pets:

Explore pets via the dynamic carousel or search filters.

- Submit Adoption Request:

Fill out the adoption form and upload required documents.

- Chat with Owners:

Communicate in real-time after approval.

- Admin Access:

Manage requests and monitor adoption history.
## 👥 Team Members
- Nabila Islam (210042111)

- Nazifa Tasneem (210042114)

- Tasnia Anwer Medha (210042124)

## 📜 License
This project is licensed under the MIT License. See LICENSE for details.

## 🙏 Acknowledgments
- Academic Supervisor: Sabrina Islam, Lecturer, IUT.

- Industry Supervisor: Mohammad Galib Shams.

Special thanks to IUT for guidance and resources.
