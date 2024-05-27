import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./views/HomePage";
import WishPage from "./views/WishPage";
import WishListPage from "./views/WishListPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/wish" element={<WishPage />} />
        <Route exact path="/wishlist" element={<WishListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
