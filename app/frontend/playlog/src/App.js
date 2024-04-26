import './App.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import SignUpSuccessPage from './pages/SignUpSuccessPage';
import MainPage from './pages/MainPage'
import GamePage from './pages/GamePage'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup-success" element={<SignUpSuccessPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/game/:id" element={<GamePage />} /> {/* or name or whatever i dont know how the query will be made*/}
      </Routes>
    </Router>

  );
}

export default App;
