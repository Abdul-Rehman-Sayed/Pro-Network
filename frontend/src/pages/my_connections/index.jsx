import {
  acceptConnection,
  getMyconnections,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { baseURL } from "@/config";
import { useRouter } from "next/router";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyconnections({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (authState.connectionRequest.length != 0) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}
        >
          <h1>My Connections</h1>

          {authState.connectionRequest.length === 0 && (
            <h2>No Connection Requests</h2>
          )}
          {authState.connectionRequest.length != 0 &&
            authState.connectionRequest
              .filter((connection) => connection.status_accepted === null)
              .map((user, index) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                    key={index}
                    className={styles.userCard}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={styles.profilePic}>
                        <img
                          src={`${baseURL}/${user.userId.profilePic}`}
                          alt=""
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h1>{user.userId.name}</h1>
                        <p>{user.userId.username}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          console.log("connection object:", user);
                          console.log("requestId being sent:", user._id);

                          if (!user._id) {
                            console.error("requestId is undefined");
                            return;
                          }

                          dispatch(
                            acceptConnection({
                              requestId: user._id,
                              token: localStorage.getItem("token"),
                              action: "accept",
                            }),
                          );
                        }}
                        className={styles.connectedButton}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>
        <h2>My Network</h2>
        {authState.connectionRequest
          .filter((connection) => connection.status_accepted !== null)
          .map((user, index) => {
            return (
              <div
                onClick={() => {
                  router.push(`/view_profile/${user.userId.username}`);
                }}
                key={index}
                className={styles.userCard}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                    justifyContent: "space-between",
                  }}
                >
                  <div className={styles.profilePic}>
                    <img src={`${baseURL}/${user.userId.profilePic}`} alt="" />
                  </div>
                  <div className={styles.userInfo}>
                    <h1>{user.userId.name}</h1>
                    <p>{user.userId.username}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </DashboardLayout>
    </UserLayout>
  );
}
