import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Dashboard from "./components/Dashboard";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import PrivateRoutes from "./components/PrivateRoutes";
import Settings from "./components/Settings";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<PrivateRoutes />}>
          <Route path="/" exact element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </div>
  )
}

export default App;
