import Navbar from "@/components/navbar";
import React from "react";

const UserLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default UserLayout;
