import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostAd from './pages/PostAd';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post-ad" element={<PostAd />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
