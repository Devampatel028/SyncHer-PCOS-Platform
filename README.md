# SyncHer – Smart PCOS Care Platform

SyncHer is an AI-powered PCOS prediction and personalized care platform that guides users from awareness to diagnosis and continuous health assistance.

## Features
- **AI-Powered Prediction**: Uses Google Gemini to analyze health data and predict PCOS risk.
- **Personalized Care**: Tailored diet, exercise, stress management, and skincare advice.
- **Context-Aware Chatbot**: A global floating AI assistant that knows your health history.
- **Modern UI**: Premium healthcare-themed design using Tailwind CSS.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini API

## Setup Instructions

### Backend
1. Navigate to `/backend`
2. Run `npm install`
3. Create a `.env` file based on `.env.example`:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Run `npm start` (or `node server.js`)

### Frontend
1. Navigate to `/frontend`
2. Run `npm install`
3. Run `npm run dev`

## Data Flow
1. User registers/logs in.
2. User reads PCOS awareness info.
3. User completes a comprehensive health questionnaire.
4. Data is sent to the backend, which consults Gemini AI.
5. AI returns a structured report stored in MongoDB.
6. User views personalized dashboard and specific care modules.
7. Floating chatbot provides ongoing support using the health assessment context.
