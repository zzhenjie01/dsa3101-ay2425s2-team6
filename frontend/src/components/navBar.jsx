import './navBar.css';
import { useContext } from 'react';
import { SidePanelContext } from '../context/contexts';


export function SidePanelToggleButton()
{
  const { sidePanelIsOpen, setSidePanelIsOpen } = useContext(SidePanelContext);
  return (
    <button 
      onClick={() => setSidePanelIsOpen(!sidePanelIsOpen)}
      className="
      h-9/10 w-1/10
      text-white
      bg-violet-700 rounded-lg
      m-2">
      Click to toggle
    </button>
  );
}

export default function NavBar()
{
    return (
      <nav className="
          border-gray-200 border-2
          fixed top-0
          h-20
          flex items-center
          w-full">
        <SidePanelToggleButton/>
      </nav>
    )
}