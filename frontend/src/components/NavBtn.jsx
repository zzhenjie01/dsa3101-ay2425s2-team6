import "./NavBtn.css";
import { useContext } from "react";
import { SidePanelContext } from "../context/contexts";

export function SidePanelToggleButton() {
  const { sidePanelIsOpen, setSidePanelIsOpen } = useContext(SidePanelContext);
  return (
    <button
      onClick={() => setSidePanelIsOpen(!sidePanelIsOpen)}
      className="
        flex flex-col justify-center items-center
        w-10 h-10
        text-violet-700 hover:text-violet-900
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50
      "
      aria-label="Toggle navigation menu"
    >
      <span className="sr-only">Toggle navigation menu</span>
      <span className="w-6 h-0.5 bg-current mb-1.5"></span>
      <span className="w-6 h-0.5 bg-current mb-1.5"></span>
      <span className="w-6 h-0.5 bg-current"></span>
    </button>
  );
}

export default function NavBtn() {
  return (
    <div className="absolute top-4 left-4">
      <SidePanelToggleButton />
    </div>
  );
}
