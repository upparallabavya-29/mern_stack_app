import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import InterviewSession from './pages/InterviewSession';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview/:id" element={<InterviewSession />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
