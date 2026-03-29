# MyMedRec - PromptWars AI Hackathon 🏆

**MyMedRec** is a Gemini-powered ambient medical AI solution designed for the "Societal Benefit" challenge at the PromptWars AI Hackathon. It transforms unstructured doctor-patient conversations into structured, life-saving medical data in real-time.

## 🌟 Features

- **Real-time Speech-to-Text:** Live audio streaming from the browser to the backend using WebSockets, leveraging **Google Cloud Speech-to-Text** with speaker diarization (differentiating between Doctor and Patient).
- **AI-Powered Medical Intelligence:** Uses the **Gemini API** to automatically extract medications, medical keywords, and clinical context from the live transcript.
- **Secure Access:** Dashboard is protected by **Google Authentication** to ensure only authorized users can connect.
- **Modern & Responsive UI:** Built with **React**, **Vite**, and **TailwindCSS** for a seamless, accessible user experience.
- **Production Ready:** Includes robust unit/component testing (Vitest) and a cloud-ready architecture (deployable to Google Cloud Run).

## 🛠️ Tech Stack

### Frontend
- **React 19** & **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Google OAuth** (`@react-oauth/google`)

### Backend
- **Node.js** & **Express**
- **WebSockets** (`ws` for real-time audio chunk streaming)
- **Google Cloud Speech-to-Text API** (`@google-cloud/speech`)
- **Google Generative AI** (`@google/genai`)

## 🚀 How to Run It

To run this project locally, you will need to start both the backend Node.js server and the frontend Vite development server.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- A **Google Cloud Platform (GCP)** account with the **Speech-to-Text API** enabled, and a service account key (JSON).
- A **Gemini API Key**.
- A **Google OAuth Client ID** (for web application).

### 1. Setup & Run the Backend

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_APPLICATION_CREDENTIALS=./path-to-your-gcp-service-account.json
   ```
4. Start the backend server:
   ```bash
   node index.js
   ```
   *The server will typically start on port 3001.*

### 2. Setup & Run the Frontend

1. Open a new terminal and navigate to the project root directory:
   ```bash
   cd path/to/promptwars
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory (you can copy `.env.example`):
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`). Have a Google account ready to log in!

## 🧪 Running Tests

This project uses **Vitest** for testing both the frontend and the backend.

- **Frontend Tests:**
  Run `npm test` or `npm run test:coverage` in the **root** directory.
- **Backend Tests:**
  Run `npm test` or `npm run test:coverage` in the **server** directory.

---
*Built with ❤️ for the PromptWars AI Hackathon.*
