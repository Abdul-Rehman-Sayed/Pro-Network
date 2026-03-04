import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const DiscoverPage = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched]);

  return (
    <UserLayout>
      <DashboardLayout>
        <h1>Discover</h1>
      </DashboardLayout>
    </UserLayout>
  );
};

export default DiscoverPage;
