import React from "react";
import { useState, useContext } from "react";
import { UserContext } from "../context/context.js";
import SidePanel from "./SidePanel";
import NavBtn from "./NavBtn";
import LoginBtn from "./LoginBtn";
import LogoutBtn from "./LogoutBtn";
import WelcomeMsg from "./welcomeMsg.jsx";
import WeightsButton from "./WeightsButton.jsx";
// import ChatbotDiv from "../components/ChatbotToggle";
import { SidePanelContext } from "../context/context.js";
import { useLocation } from "react-router-dom";

const sidePanelButtonsLst = [
  {
    idx: 1,
    webUrl: "/home",
    // imgUrl: "/assets/home.png",
    webName: "Home",
  },

  {
    idx: 2,
    webUrl: "/leaderboard",
    // imgUrl: "/assets/dashboard.png",
    webName: "Leaderboard",
  },

  {
    idx: 3,
    webUrl: "/dashboard",
    // imgUrl: "/assets/dashboard.png",
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
  console.log(location.pathname);
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
        <div className="relative">
          <WelcomeMsg />
          <WeightsButton />
          {!user || user.name === "Guest" ? <LoginBtn /> : <LogoutBtn />}
        </div>
      </SidePanelContext.Provider>
    </header>
  );
}
