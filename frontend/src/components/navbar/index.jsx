import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h2 onClick={() => router.push("/")}>Pro-Network</h2>
        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched ? (
            <div>
              <div>
                <p className={styles.greeting}>
                  Hi, {authState.user.userId.name}
                </p>
                <p className={styles.navLink}>Profile</p>
                <p
                  className={styles.logoutLink}
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                    dispatch(reset());
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
