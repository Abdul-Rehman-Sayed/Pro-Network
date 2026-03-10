import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { baseURL } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function MyProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
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
                  <p className={styles.bioText}>{userProfile.bio}</p>
                </div>

                <div className={styles.profileRight}>
                  <h3 className={styles.recentActivityTitle}>
                    Recent Activity
                  </h3>
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
                {userProfile.pastWork?.length === 0 && (
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
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
