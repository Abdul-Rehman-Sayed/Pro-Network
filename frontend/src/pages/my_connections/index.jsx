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

  const pendingRequests = authState.connectionRequest.filter(
    (c) => c.status_accepted === null,
  );

  const acceptedConnections = authState.connectionRequest.filter(
    (c) => c.status_accepted !== null,
  );

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Connection Requests</h2>
            {pendingRequests.length === 0 ? (
              <p className={styles.emptyText}>
                No pending connection requests.
              </p>
            ) : (
              pendingRequests.map((user, index) => (
                <div
                  onClick={() =>
                    router.push(`/view_profile/${user.userId.username}`)
                  }
                  key={index}
                  className={styles.userCard}
                >
                  <div className={styles.profilePic}>
                    <img src={`${baseURL}/${user.userId.profilePic}`} alt="" />
                  </div>
                  <div className={styles.userInfo}>
                    <h3>{user.userId.name}</h3>
                    <p>@{user.userId.username}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user._id) return;
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
              ))
            )}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>My Network</h2>
            {acceptedConnections.length === 0 ? (
              <p className={styles.emptyText}>No connections yet.</p>
            ) : (
              acceptedConnections.map((user, index) => (
                <div
                  onClick={() =>
                    router.push(`/view_profile/${user.userId.username}`)
                  }
                  key={index}
                  className={styles.userCard}
                >
                  <div className={styles.profilePic}>
                    <img src={`${baseURL}/${user.userId.profilePic}`} alt="" />
                  </div>
                  <div className={styles.userInfo}>
                    <h3>{user.userId.name}</h3>
                    <p>@{user.userId.username}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
