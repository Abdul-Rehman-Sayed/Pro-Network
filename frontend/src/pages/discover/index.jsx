import { baseURL } from "@/config";
import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { useRouter } from "next/router";

const DiscoverPage = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h2 className={styles.title}>Discover</h2>
          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((user) => (
                <div
                  onClick={() =>
                    router.push(`/view_profile/${user.userId.username}`)
                  }
                  key={user._id}
                  className={styles.userCard}
                >
                  <img
                    className={styles.userCardImage}
                    src={`${baseURL}/${user.userId.profilePic}`}
                    alt="Profile Picture"
                  />
                  <div className={styles.userInfo}>
                    <h3 className={styles.userName}>{user.userId.name}</h3>
                    <p className={styles.userHandle}>@{user.userId.username}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
};

export default DiscoverPage;
