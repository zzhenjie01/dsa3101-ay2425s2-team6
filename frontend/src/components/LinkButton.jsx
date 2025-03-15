import React from "react";
import { Link } from "react-router-dom";
import { GoHome, GoGraph, GoTrophy } from "react-icons/go";
import { IconContext } from "react-icons";

function LinkButton(props) {
  const logos = {
    Home: <GoHome />,
    Leaderboard: <GoTrophy />,
    Dashboard: <GoGraph />,
  };
  return (
    <Link
      key={props.idx}
      to={props.webUrl}
      className="
      block
      p-6
      h-full w-full
      font-sans font-semibold font-size
      text-left align-middle text-white
      hover:bg-emerald-500
      cursor-pointer
      "
    >
      <IconContext.Provider value={{ size: 35 }}>
        {logos[props.webName]}
      </IconContext.Provider>
      {props.webName}
    </Link>
  );
}

export default LinkButton;
