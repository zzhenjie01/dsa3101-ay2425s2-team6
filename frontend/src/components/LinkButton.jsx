import React from "react";
import { Link } from "react-router-dom";

function LinkButton(props) {
  return (
    <Link
      key={props.idx}
      to={props.webUrl}
      className="
      block
      p-6
      h-20 w-full
      font-sans font-semibold font-size
      text-left align-middle text-white
      hover:bg-emerald-500
      cursor-pointer
      "
    >
      {props.webName}
    </Link>
  );
}

export default LinkButton;
