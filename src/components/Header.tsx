// components/Header.tsx
import React from "react";
import logo from "../logo1.png";

const Header = () => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "20px",
        borderBottom: "1px solid #ddd",
        marginBottom: "30px",
      }}
    >
      <img src={logo} alt="App Logo" style={{ height: "60px" }} />
      <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 600 }}>
        HABITAT – Health Affected by Climate & Air
      </h1>
    </header>
  );
};

export default Header;
