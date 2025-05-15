import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Resources from './pages/Resources';
import Grievances from './pages/Grievances';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
                <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
                <Route path="/grievances" element={<PrivateRoute><Grievances /></PrivateRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;