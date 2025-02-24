import "./dashboardPage.css";
import { useState } from "react";
import SidePanel from "../components/SidePanel";
import NavBar from "../components/NavBtn";
import ChatbotDiv from "../components/ChatbotToggle";
import { SidePanelContext } from "../context/contexts";

const sidePanelButtonsLst = [
  { idx: 1, buttonName: "ESG Dashboard", onClickText: "ESG Dashboard View" },
  { idx: 2, buttonName: "Edit Weights", onClickText: "Edit Weights View" },
  {
    idx: 3,
    buttonName: "Company Summary",
    onClickText: "Company Summary View",
  },
  {
    idx: 4,
    buttonName: "Company Financial Indicators",
    onClickText: "Company Financial Indicators View",
  },
];

export default function DashboardPage() {
  // const [sidePanelIsOpen, setSidePanelIsOpen] = useState(false);
  // const sidePanelToggleObj = {
  //   sidePanelIsOpen,
  //   setSidePanelIsOpen,
  // };
  // return (
  //   <>
  //     <SidePanelContext.Provider value={sidePanelToggleObj}>
  //       <NavBar />
  //       <SidePanel buttonLst={sidePanelButtonsLst} />
  //     </SidePanelContext.Provider>
  //     <ChatbotDiv />
  //   </>
  // );
  return (
    <div>
      <p> Welcome to the Dashboard page</p>
    </div>
  );
}
