import Navbar from "@/components/navbar";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";

const UserLayout = ({ children }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !authState.profileFetched) {
      dispatch(getAboutUser({ token }));
    }
  }, []);

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default UserLayout;
