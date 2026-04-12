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

  if (!userProfile || !userProfile.userId) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.container}>
            <p className={styles.emptyText}>Profile not found</p>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }

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
    const outgoing = authState.connections?.find(
      (c) => c.connectionId?._id === targetId || c.connectionId === targetId,
    );
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
    ).then(() => setConnectionStatus("pending"));
  };

  const isOwnProfile = authState.user?.userId?._id === userProfile.userId._id;

  const renderConnectionButton = () => {
    if (isOwnProfile) {
      return null;
    }
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

          <div className={styles.profileCard}>
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
                  window.open(`${baseURL}/${response.data.message}`, "_blank");
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
            {userProfile.bio && (
              <p className={styles.bioText}>{userProfile.bio}</p>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h4>Recent Activity</h4>
            </div>
            {userPosts.length === 0 ? (
              <p className={styles.emptyText}>No recent activity.</p>
            ) : (
              <div className={styles.activityList}>
                {userPosts.map((post) => (
                  <div key={post._id} className={styles.activityItem}>
                    {post.media && post.media !== "" && (
                      <img
                        className={styles.activityMedia}
                        src={`${baseURL}/${post.media}`}
                        alt=""
                      />
                    )}
                    <p className={styles.activityBody}>{post.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h4>Work History</h4>
            </div>
            {!userProfile.pastWork || userProfile.pastWork.length === 0 ? (
              <p className={styles.emptyText}>No work history added.</p>
            ) : (
              userProfile.pastWork.map((work, index) => (
                <div key={index} className={styles.historyCard}>
                  <div className={styles.historyIcon}>
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
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </div>
                  <div className={styles.historyText}>
                    <p className={styles.historyPrimary}>{work.company}</p>
                    <p className={styles.historySecondary}>{work.position}</p>
                    <p className={styles.historyTertiary}>{work.years} years</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {userProfile.education && userProfile.education.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4>Education</h4>
              </div>
              {userProfile.education.map((edu, index) => (
                <div key={index} className={styles.historyCard}>
                  <div className={styles.historyIcon}>
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
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                      />
                    </svg>
                  </div>
                  <div className={styles.historyText}>
                    <p className={styles.historyPrimary}>{edu.school}</p>
                    <p className={styles.historySecondary}>{edu.degree}</p>
                    <p className={styles.historyTertiary}>{edu.fieldOfStudy}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const request = await clientServer.get(
      "/user/get_profile_based_on_username",
      {
        params: { username: context.query.username },
      },
    );
    
    if (!request.data.profile) {
      return {
        notFound: true,
      };
    }
    
    return { props: { userProfile: request.data.profile } };
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return {
      notFound: true,
    };
  }
}
