import './App.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#F3F3E0',
      paper: '#DCE4C9', 
    },
    primary: {
      main: '#A0D683',
    },
    secondary: {
      main: '#72BF78',
    },
    text: {
      primary: '#333333',
      secondary: '#333333',
      other: "#FFFFFF"
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  </ThemeProvider>
  );
}

export default App;
