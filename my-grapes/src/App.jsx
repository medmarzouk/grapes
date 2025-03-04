import React from 'react';
import Editor from './Editor';
import "./styles/main.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Thème de PrimeReact
import 'primereact/resources/primereact.min.css';                  // Styles de base de PrimeReact
import 'primeicons/primeicons.css';                                // Icônes de PrimeIcons
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';
import ChatInterface from './pages/ChatInterface';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/editor/:pageId" element={<Editor />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ChatInterface/>}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
