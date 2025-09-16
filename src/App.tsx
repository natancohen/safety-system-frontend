import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import FormPage from './pages/FormPage/FormPage';
import EventsPage from './pages/EventsPage/EventsPage';
import './App.css';
import ThemeToggleButton from './lightMode/ThemeToggleButton';


function App() {
  return (
    <div className="app" dir="rtl">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Routes>
      </BrowserRouter>
      <ThemeToggleButton />
    </div>
  );
}

export default App;