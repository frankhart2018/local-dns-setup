import React from "react";

import "./NavBar.css";

const NavBar = () => {
  return (
    <nav style={{ backgroundColor: "black", padding: "10px 5px" }}>
      <span
        style={{
          color: "white",
          textAlign: "left",
          margin: "0",
          fontSize: "1.5em",
        }}
      >
        Local DNS
      </span>
      <div
        style={{
          display: "inline-flex",
          justifyContent: "justify-content",
          float: "right",
          marginRight: "1%",
        }}
      >
        <button
          className="nav-button"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          List Zones
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
