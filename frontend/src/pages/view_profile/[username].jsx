import { baseURL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionRequest,
  getMyconnections,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("none");
  // "none" | "pending" | "connected"

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getConnectionRequest({ token: localStorage.getItem("token") }));
    dispatch(getMyconnections({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    const posts = postReducer.posts.filter(
      (post) => post.userId.username === router.query.username,
    );
    setUserPosts(posts);
  }, [postReducer.posts]);

  useEffect(() => {
    const targetId = userProfile.userId._id;

    // outgoing: current user sent request — target is stored under connectionId
    const outgoing = authState.connections?.find(
      (c) => c.connectionId?._id === targetId || c.connectionId === targetId,
    );

    // incoming: target user sent request to current user — sender stored under userId
    const incoming = authState.connectionRequest?.find(
      (c) => c.userId?._id === targetId || c.userId === targetId,
    );

    if (outgoing) {
      setConnectionStatus(
        outgoing.status_accepted === true ? "connected" : "pending",
      );
    } else if (incoming) {
      setConnectionStatus(
        incoming.status_accepted === true ? "connected" : "pending",
      );
    } else {
      setConnectionStatus("none");
    }
  }, [authState.connections, authState.connectionRequest]);

  const handleConnect = () => {
    dispatch(
      sendConnectionRequest({
        token: localStorage.getItem("token"),
        user_id: userProfile.userId._id,
      }),
    ).then(() => {
      setConnectionStatus("pending");
    });
  };

  const renderConnectionButton = () => {
    if (connectionStatus === "connected") {
      return <button className={styles.connectedButton}>Connected</button>;
    }
    if (connectionStatus === "pending") {
      return (
        <button className={styles.pendingButton} disabled>
          Pending
        </button>
      );
    }
    return (
      <button onClick={handleConnect} className={styles.connectBtn}>
        Connect
      </button>
    );
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img src={`${baseURL}/${userProfile.userId.profilePic}`} alt="" />
          </div>

          <div className={styles.profileContainerDetails}>
            <div>
              <div className={styles.profileLeft}>
                <div className={styles.nameRow}>
                  <h2>{userProfile.userId.name}</h2>
                  <p>@{userProfile.userId.username}</p>
                </div>

                <div className={styles.actionRow}>
                  {renderConnectionButton()}

                  <div
                    className={styles.downloadBtn}
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId._id}`,
                      );
                      window.open(
                        `${baseURL}/${response.data.message}`,
                        "_blank",
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                <p className={styles.bioText}>{userProfile.bio}</p>
              </div>

              <div className={styles.profileRight}>
                <h3 className={styles.recentActivityTitle}>Recent Activity</h3>
                {userPosts.length === 0 && (
                  <p className={styles.emptyText}>No recent activity.</p>
                )}
                {userPosts.map((post) => (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.cardProfileContainer}>
                        {post.media !== "" ? (
                          <img src={`${baseURL}/${post.media}`} alt="" />
                        ) : (
                          <div style={{ width: "52px", height: "52px" }} />
                        )}
                      </div>
                      <p className={styles.cardBody}>{post.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div>
              {(!userProfile.pastWork || userProfile.pastWork.length === 0) && (
                <p className={styles.emptyText}>No work history added.</p>
              )}
              {userProfile.pastWork?.map((work, index) => (
                <div key={index} className={styles.workHistoryCard}>
                  <p>
                    {work.company} — {work.position}
                  </p>
                  <p>{work.years} years</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: { username: context.query.username },
    },
  );
  return { props: { userProfile: request.data.profile } };
}
