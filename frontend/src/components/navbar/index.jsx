import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h2 onClick={() => router.push("/")}>Pro-Network</h2>
        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && authState.user?.userId ? (
            <div>
              <div>
                <p className={styles.greeting}>
                  Hi, {authState.user.userId.name}
                </p>
                <p
                  onClick={() => router.push("/profile")}
                  className={styles.navLink}
                >
                  Profile
                </p>
                <p
                  className={styles.logoutLink}
                  onClick={() => {
                    localStorage.removeItem("token");
                    dispatch(reset());
                    router.push("/login");
                  }}
                >
                  Log Out
                </p>
              </div>
            </div>
          ) : (
            <div
              onClick={() => router.push("/login")}
              className={styles.joinButton}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
