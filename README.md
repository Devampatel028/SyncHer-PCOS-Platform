<div align="center">

<h1>🌸 Saheli – Smart PCOS Care Platform</h1>

<p><strong>An AI-powered women's health platform for PCOS symptom analysis, personalized insights, and continuous health guidance.</strong></p>

![License](https://img.shields.io/badge/license-Educational-pink?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-18%2B-blue?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=flat-square&logo=mongodb)
![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-orange?style=flat-square&logo=google)

</div>

---

## 📖 About

**Saheli** is a full-stack AI-powered PCOS health assistant platform designed to help women understand their symptoms, receive AI-generated health reports, and get personalized care recommendations. Users complete a comprehensive health assessment, which is analyzed by **Google Gemini AI** to generate a structured PCOS prediction report. The platform also features a context-aware chatbot, voice support, and a skin analysis service.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **User Authentication** | Secure login & registration with JWT |
| 📋 **Health Assessment Form** | Comprehensive PCOS symptom questionnaire |
| 🤖 **AI PCOS Prediction** | Gemini AI analyzes data & generates a health report |
| 💬 **AI Chatbot** | Context-aware floating assistant for health guidance |
| 🎙️ **Voice Commands** | Voice input support for the chatbot |
| 🩺 **Doctor Consultation** | Image upload for doctor review |
| 🖼️ **Skin Analysis** | OpenCV-based skin condition analysis |
| 🛡️ **Admin Dashboard** | Manage users, doctors, and platform insights |
| 📊 **Personalized Dashboard** | Tailored diet, exercise & skincare recommendations |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** – Component-based UI
- **Tailwind CSS** – Utility-first styling
- **React Router** – Client-side navigation
- **Vite** – Fast development build tool

### Backend
- **Node.js** + **Express.js** – RESTful API server
- **MongoDB** + **Mongoose** – Database & ODM
- **JWT** – Secure authentication
- **Multer** – File/image upload handling
- **Nodemailer** – Email notifications

### AI & Services
- **Google Gemini API** – PCOS prediction & chatbot AI
- **OpenCV (Python)** – Skin analysis microservice

---

## 🗂️ Project Structure

```
Saheli-Smart PCOS Care/
├── frontend/               # React.js frontend (Vite)
│   └── src/
│       ├── pages/          # All page components
│       ├── components/     # Reusable UI components
│       └── assets/         # Static assets
│
├── backend/                # Node.js/Express backend
│   ├── models/             # Mongoose data models
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic & AI integration
│   └── middleware/         # Auth & error middleware
│
└── opencv_service/         # Python OpenCV skin analysis service
    ├── app.py
    └── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.8+ (for OpenCV service)
- MongoDB Atlas account
- Google Gemini API key

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:

```bash
npm run dev        # Development (with nodemon)
# or
npm start          # Production
```

The backend runs on **http://localhost:5000**

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**

---

### 4️⃣ OpenCV Skin Analysis Service (Optional)

```bash
cd opencv_service
pip install -r requirements.txt
python app.py
```

> On Windows, you can also run `run_opencv.bat` from the project root.

The service runs on **http://localhost:8000**

---

## 🔄 Data Flow

```
User Registers / Logs In
        ↓
Reads PCOS Awareness Info
        ↓
Completes Health Assessment Form
        ↓
Data sent to Backend API
        ↓
Backend consults Google Gemini AI
        ↓
AI generates structured PCOS report
        ↓
Report stored in MongoDB
        ↓
User views personalized Dashboard & Care Modules
        ↓
Floating Chatbot provides ongoing support
```

---

## 🔮 Future Improvements

- [ ] Real medical dataset integration for improved AI accuracy
- [ ] Custom AI model training for PCOS prediction
- [ ] Mobile app (React Native / Flutter)
- [ ] Doctor appointment booking system
- [ ] Wearable device data integration
- [ ] Multi-language support

---

## 👤 Author

**Devam Patel**

---

## 📄 License

This project is built for **educational and research purposes**.
It is not a substitute for professional medical advice.
Always consult a qualified healthcare provider for medical decisions.

---

<div align="center">
  Made with 🌸 for women's health by <strong>Devam Patel</strong>
</div>
