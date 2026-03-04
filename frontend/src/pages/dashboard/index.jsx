import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
      } else {
        dispatch(getAllPosts());
        dispatch(getAboutUser({ token }));
      }
    }
  }, [router, dispatch]);

  return (
    <UserLayout>
      <DashboardLayout></DashboardLayout>
    </UserLayout>
  );
};

export default Dashboard;
