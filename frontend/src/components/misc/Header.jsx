import React from "react";
import { useState, useContext } from "react";
import { UserContext, SidePanelContext } from "@/context/context.js";
import SidePanel from "./SidePanel";
import NavBtn from "./NavBtn";
import LoginBtn from "./LoginBtn.jsx";
import LogoutBtn from "./LogoutBtn";
import WelcomeMsg from "./welcomeMsg.jsx";
import WeightsButton from "./WeightsButton.jsx";
import { useLocation } from "react-router-dom";
import { GoHome, GoGraph, GoTrophy } from "react-icons/go";

const sidePanelButtonsLst = [
  {
    idx: 1,
    webUrl: "/home",
    logo: <GoHome />,
    webName: "Home",
  },

  {
    idx: 2,
    webUrl: "/leaderboard",
    logo: <GoTrophy />,
    webName: "Leaderboard",
  },

  {
    idx: 3,
    webUrl: "/dashboard",
    logo: <GoGraph />,
    webName: "Dashboard",
  },
];

export default function Header() {
  const { user } = useContext(UserContext);
  const [sidePanelIsOpen, setSidePanelIsOpen] = useState(false);
  const sidePanelToggleObj = {
    sidePanelIsOpen,
    setSidePanelIsOpen,
  };

  // Do not show header if at login-page/register-page
  const location = useLocation();
  if (
    location.pathname === "/login-page" ||
    location.pathname === "/register-page"
  ) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white shadow-md z-10">
      <SidePanelContext.Provider
        className="container mx-auto h-full flex items-center justify-between px-4"
        value={sidePanelToggleObj}
      >
        <NavBtn />
        <SidePanel buttonLst={sidePanelButtonsLst} />
        <WeightsButton />
        <h1 class="text-3xl mb-2 text-black p-4 text-center">
          ESG Insights Platform
        </h1>
        <WelcomeMsg />
        {!user || user.name === "Guest" ? <LoginBtn /> : <LogoutBtn />}
      </SidePanelContext.Provider>
    </header>
  );
}
