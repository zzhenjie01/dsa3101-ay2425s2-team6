import { useContext, useEffect, useRef } from "react";
import LinkButton from "./LinkButton";
import { SidePanelContext } from "@/context/context.js";

export function SidePanelOptions({ buttonLst }) {
  return (
    <div>
      {buttonLst.map((btn) => (
        <LinkButton key={btn.idx} {...btn} />
      ))}
    </div>
  );
}

export default function SidePanel({ buttonLst }) {
  const { sidePanelIsOpen, setSidePanelIsOpen } = useContext(SidePanelContext);
  const sidePanelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidePanelRef.current &&
        !sidePanelRef.current.contains(event.target)
      ) {
        setSidePanelIsOpen(false);
      }
    }

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSidePanelIsOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-opacity-50 transition-opacity duration-300 ease-in-out ${
          sidePanelIsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidePanelIsOpen(false)}
      />
      {/* Side Panel */}
      <div
        ref={sidePanelRef}
        className={`flex-col
                  bg-emerald-700
                  h-screen
                  fixed top-20
                  2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-2/5 w-4/5
                  transform transition-all duration-300 ease-in-out
                  ${sidePanelIsOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidePanelOptions buttonLst={buttonLst} />
      </div>
    </>
  );
}
