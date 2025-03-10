import { useState } from "react";
import SidePanel from "../components/SidePanel";
import NavBar from "../components/NavBtn";
// import { SidePanelContext } from "../context/contexts";
import Chart from "../components/Chart";

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
    <div className="flex-grow pt-20 text-center">
      <p>Dashboard</p>
      <p className="h-48 w-96 object-cover flex">
        <Chart className="justify-center" />
      </p>
    </div>
  );
}
