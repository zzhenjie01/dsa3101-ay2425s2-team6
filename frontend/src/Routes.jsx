import React from "react";
// import { Outlet } from "react-router";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/homePage";
import Dashboard from "./pages/dashboardPage";
import Leaderboard from "./pages/leaderboardPage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";

export default function AppRoutes() {
  return (
    <Routes className="flex flex-col min-h-screen">
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      {/* <Route path="/forecast" element={<Forecast />} /> */}
      <Route path="/login-page" element={<LoginPage />} />
      <Route path="/register-page" element={<RegisterPage />} />
    </Routes>
  );
}
