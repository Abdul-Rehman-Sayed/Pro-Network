import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React from "react";

const MyConnectionsPage = () => {
  return (
    <UserLayout>
      <DashboardLayout>
        <h1>My Connections</h1>
      </DashboardLayout>
    </UserLayout>
  );
};

export default MyConnectionsPage;
