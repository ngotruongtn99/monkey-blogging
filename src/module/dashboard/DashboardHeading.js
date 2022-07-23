import React from "react";

const DashboardHeading = ({ children, title = "", desc = "" }) => {
  return (
    <div className="flex items-center justify-between mb-10">
      <div className="">
        <h1 className="dashboard-heading">{title}</h1>
        <p className="dashboard-short-desc">{desc}</p>
      </div>
      {children}
    </div>
  );
};

export default DashboardHeading;
