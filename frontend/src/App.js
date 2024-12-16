import './App.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import ArchivePage from './pages/ArchivePage';
import CommentPage from './pages/CommentPage';
import ProfilePage from './pages/ProfilePage';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#F3F3E0',
      paper: '#DCE4C9', 
      annotation: '#c9d6ac',
    },
    primary: {
      main: '#A0D683',
      light: '#A0D683',
      dark: '#5F8B4F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#628B48',
      light: '#7FA866',
      dark: '#4A6934',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#2C3E2D',
      secondary: '#4A5D4B',
    },
    grey: {
      50: '#F0F4E8',
      100: '#E1E9D5',
      200: '#D2DEC2',
    },
    divider: '#C9D6B8',
    action: {
      hover: '#EDF2E3',
      selected: '#DCE6CC',
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial',
    h4: {
      fontWeight: 500,
      color: '#2C3E2D',
    },
    h6: {
      fontWeight: 500,
      color: '#2C3E2D',
    },
    fontSize: 16,
    body1: {
      fontSize: '1.1rem',
    },
    body2: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
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
          <Route path="/home/:tag" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/post/:id/comments" element={<CommentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
    </Router>
  </ThemeProvider>
  );
}

export default App;
