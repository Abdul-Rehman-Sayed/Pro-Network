import { baseURL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const gerUserPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionRequest({ token: localStorage.getItem("token") }),
    );
  };

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);

  useEffect(() => {
    if (
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id,
      )
    ) {
      setIsCurrentUserInConnection(true);
    }
  }, [authState.connections]);

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

                {isCurrentUserInConnection ? (
                  <button className={styles.connectedButton}>Connected</button>
                ) : (
                  <button
                    onClick={() => {
                      dispatch(
                        sendConnectionRequest({
                          token: localStorage.getItem("token"),
                          user_id: userProfile.userId._id,
                        }),
                      );
                    }}
                    className={styles.connectBtn}
                  >
                    Connect
                  </button>
                )}

                <p className={styles.bioText}>{userProfile.bio}</p>
              </div>

              <div className={styles.profileRight}>
                <h3 className={styles.recentActivityTitle}>Recent Activity</h3>
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
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    { params: { username: context.query.username } },
  );

  const response = await request.data;
  console.log(response);
  return { props: { userProfile: request.data.profile } };
}
