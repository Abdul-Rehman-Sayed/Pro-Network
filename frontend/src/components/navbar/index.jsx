import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Navbar = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1 style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          Pro-Network
        </h1>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <p>Hi, {authState.user.userId.name}</p>
                <p style={{ fontWeight: "bold", cursor: "pointer" }}>Profile</p>
              </div>
            </div>
          )}

          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
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
