import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home_page/home_page';
import FormPage from './pages/form_page/form_page';
import EventsPage from './pages/events_page/events_page';
import './App.css';
import ThemeToggleButton from './light_mode/theme_toggle_button';


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