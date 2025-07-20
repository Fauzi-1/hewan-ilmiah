// routes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import AnimalList from './pages/AnimalList';
import Quiz from './pages/Quiz';
import Chatbot from './pages/Chatbot';
import MiniGame from './pages/MiniGame';
import AdminLogin from './pages/AdminLogin';

import Dashboard from './admin/Dashboard';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public User Pages */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/animals" element={<Layout><AnimalList /></Layout>} />
        <Route path="/quiz" element={<Layout><Quiz /></Layout>} />
        <Route path="/minigame" element={<Layout><MiniGame /></Layout>} />
        <Route path="/chatbot" element={<Layout><Chatbot /></Layout>} />

        {/* Admin Pages */}
        <Route path="/admin/login" element={<Layout><AdminLogin /></Layout>} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
