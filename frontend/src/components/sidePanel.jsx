import "./SidePanel.css";
import { useContext } from "react";
import LinkButton from "./LinkButton";
import { SidePanelContext } from "../context/contexts";
// import LinkButton from "./LinkButton";

export function SidePanelOptions({ buttonLst }) {
  // const navigate = useNavigate();
  return (
    <div>
      {buttonLst.map((btn) => (
        <LinkButton {...btn} />
      ))}
    </div>
  );
}

export default function SidePanel({ buttonLst }) {
  const { sidePanelIsOpen } = useContext(SidePanelContext);
  return (
    <div
      className={`flex-col
                  bg-emerald-700
                  h-screen
                  fixed top-20
                  xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full
                  ${sidePanelIsOpen ? "visible" : "hidden"}`}
    >
      <SidePanelOptions buttonLst={buttonLst} />
    </div>
  );
}
