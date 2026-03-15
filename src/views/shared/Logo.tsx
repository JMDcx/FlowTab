import React from "react";
import "./Logo.css";
import flowTabLogo from "../../../FlowTab.png";

const Logo: React.FC = () => (
  <h1 className="Logo">
    <span className="Logo-mark">
      <img src={flowTabLogo} alt="FlowTab" />
    </span>
    <span className="Logo-wordmark">FlowTab</span>
  </h1>
);

export default Logo;
