import { useContext } from "react";
import { SidePanelContext } from "@/context/context.js";

export function SidePanelToggleButton() {
  const { sidePanelIsOpen, setSidePanelIsOpen } = useContext(SidePanelContext);
  return (
    <button
      onClick={() => setSidePanelIsOpen(!sidePanelIsOpen)}
      className="
        flex flex-col justify-center items-center
        w-10 h-10
        bg-violet-700
        text-white
        hover:bg-violet-900
        hover:cursor-pointer
        transition-colors duration-200
        focus:outline-none
        rounded-lg shadow-md
        transition duration-300 ease-in-out
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
