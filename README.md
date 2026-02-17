# AI Mock Interview Platform

An AI-powered mock interview platform that helps users practice for interviews with real-time feedback.

## Features
- **AI-Generated Questions**: Tailored to specific roles and experience levels.
- **Real-time Feedback**: AI analysis of your answers.
- **Interview History**: Track your progress over time.
- **Dashboard**: User-friendly interface to manage interviews.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI**: OpenAI / Gemini API

## Configuration
1. Create a `.env` file in the `backend` directory.
2. Add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   MONGO_URI=mongodb://localhost:27017/ai_mock_interview
   ```

## Setup
### Backend
1. `cd backend`
2. `npm install`
3. `npm start`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
