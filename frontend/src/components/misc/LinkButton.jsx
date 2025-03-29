import React from "react";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";

function LinkButton(props) {
  const { idx, webUrl, logo, webName, ...otherProps } = props;
  return (
    <Link
      key={idx}
      to={webUrl}
      className="
      block
      p-6
      h-full w-full
      font-sans font-semibold font-size
      text-left align-middle text-white
      hover:bg-emerald-500
      cursor-pointer
      "
      {...otherProps}
    >
      <IconContext.Provider value={{ size: 35 }}>{logo}</IconContext.Provider>
      {webName}
    </Link>
  );
}

export default LinkButton;
