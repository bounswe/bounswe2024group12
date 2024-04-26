import './App.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import SignUpSuccessPage from './pages/SignUpSuccessPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProvider from './components/common/UserContext';


function App() {
  return (


    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup-success" element={<SignUpSuccessPage />} />
        </Routes>
      </UserProvider>
    </Router>

  );
}

export default App;
