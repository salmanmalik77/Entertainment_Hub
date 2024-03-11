import "./Header.css";
import React from "react";

const Header = () => {
  return (
    <span onClick={() => window.scroll(0, 0)} className="header">
      🎬Entertainment Hub🎥 salman
    </span>
  );
};

export default Header;
