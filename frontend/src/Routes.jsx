import React from "react";
// import { Outlet } from "react-router";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/homePage";
import Dashboard from "./pages/dashboardPage";
import Forecast from "./pages/forecastPage";
import LoginPage from "./pages/loginPage";
import Leaderboard from "./pages/leaderboardPage";
import "./Routes.css";

export default function AppRoutes() {
  return (
    // <BrowserRouter>
    <Routes className="flex flex-col min-h-screen">
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forecast" element={<Forecast />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/login-page" element={<LoginPage />} />
    </Routes>

    // </BrowserRouter>
  );
}
