import React from "react";
import "./Header.css";
import { useState } from "react";
import SidePanel from "./SidePanel";
import NavBtn from "./NavBtn";
import LoginBtn from "./LoginBtn";
// import ChatbotDiv from "../components/ChatbotToggle";
import { SidePanelContext } from "../context/contexts";
import { useLocation } from "react-router-dom";

const sidePanelButtonsLst = [
  {
    idx: 1,
    webUrl: "/home",
    imgUrl: "/assets/home.png",
    webName: "Home",
  },

  {
    idx: 2,
    webUrl: "/dashboard",
    imgUrl: "/assets/dashboard.png",
    webName: "Dashboard",
  },

  {
    idx: 3,
    webUrl: "/chatbot",
    imgUrl: "/assets/chatbot.png",
    webName: "Chatbot",
  },

  {
    idx: 4,
    webUrl: "/forecast",
    imgUrl: "/assets/forecast.png",
    webName: "Forecast",
  },
];

export default function Header() {
  const [sidePanelIsOpen, setSidePanelIsOpen] = useState(false);
  const sidePanelToggleObj = {
    sidePanelIsOpen,
    setSidePanelIsOpen,
    };
  const location = useLocation();
    console.log(location.pathname)
    if (location.pathname === "/login-page" || location.pathname === "/register-page") {
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
        <LoginBtn />
      </SidePanelContext.Provider>
    </header>
  );
}
