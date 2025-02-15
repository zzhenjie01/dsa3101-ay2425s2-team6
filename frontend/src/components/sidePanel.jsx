import './sidePanel.css';
import { useContext } from 'react';
import { SidePanelContext } from '../context/contexts';

export function SidePanelOptions({buttonLst})
{
  return (
    <div>
    {buttonLst.map(btn =>
      <button key={btn.idx} 
              onClick={() => alert(btn.onClickText)}
              className="
              p-6
              h-20 w-full
              font-sans font-semibold font-size
              text-left align-middle text-white
              hover:bg-emerald-500
              ">
        {btn.buttonName}
      </button>
    )}  
  </div>
  )
}

export default function SidePanel({buttonLst})
{
  const { sidePanelIsOpen } = useContext(SidePanelContext);
  return (
      <div className={`flex-col
                  bg-emerald-700
                  h-screen
                  fixed top-20
                  xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full
                  ${sidePanelIsOpen ? "visible" : "hidden"}`}>
          <SidePanelOptions buttonLst={buttonLst}/>
      </div>
  );
}