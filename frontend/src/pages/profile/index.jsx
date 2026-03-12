import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { baseURL, clientServer } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function MyProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [workModal, setWorkModal] = useState(false);
  const [workInput, setWorkInput] = useState({
    company: "",
    position: "",
    years: "",
  });
  const [editingWorkIndex, setEditingWorkIndex] = useState(null);
  const [workError, setWorkError] = useState("");
  const [eduModal, setEduModal] = useState(false);
  const [eduInput, setEduInput] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });
  const [editingEduIndex, setEditingEduIndex] = useState(null);
  const [eduError, setEduError] = useState("");

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
      setBioInput(authState.user.bio || "");
      const posts = postReducer.posts.filter(
        (post) => post.userId.username === authState.user.userId.username,
      );
      setUserPosts(posts);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));
    await clientServer.post("/update_profile_picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const saveBio = async () => {
    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: bioInput,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    setEditingBio(false);
  };

  const validateWork = () => {
    if (
      !workInput.company.trim() ||
      !workInput.position.trim() ||
      !workInput.years.toString().trim()
    ) {
      setWorkError("All fields are required.");
      return false;
    }
    const years = parseFloat(workInput.years);
    if (isNaN(years) || years < 0) {
      setWorkError("Years must be a positive number.");
      return false;
    }
    setWorkError("");
    return true;
  };

  const validateEdu = () => {
    if (
      !eduInput.school.trim() ||
      !eduInput.degree.trim() ||
      !eduInput.fieldOfStudy.trim()
    ) {
      setEduError("All fields are required.");
      return false;
    }
    setEduError("");
    return true;
  };

  const saveWork = async () => {
    if (!validateWork()) return;
    const updatedWork = [...(userProfile.pastWork || [])];
    if (editingWorkIndex !== null) {
      updatedWork[editingWorkIndex] = {
        ...workInput,
        years: parseFloat(workInput.years),
      };
    } else {
      updatedWork.push({ ...workInput, years: parseFloat(workInput.years) });
    }
    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      pastWork: updatedWork,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    setWorkModal(false);
    setWorkInput({ company: "", position: "", years: "" });
    setEditingWorkIndex(null);
    setWorkError("");
  };

  const deleteWork = async (index) => {
    const updatedWork = userProfile.pastWork.filter((_, i) => i !== index);
    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      pastWork: updatedWork,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const openEditWork = (work, index) => {
    setWorkInput(work);
    setEditingWorkIndex(index);
    setWorkError("");
    setWorkModal(true);
  };

  const saveEdu = async () => {
    if (!validateEdu()) return;
    const updatedEdu = [...(userProfile.education || [])];
    if (editingEduIndex !== null) {
      updatedEdu[editingEduIndex] = eduInput;
    } else {
      updatedEdu.push(eduInput);
    }
    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      education: updatedEdu,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    setEduModal(false);
    setEduInput({ school: "", degree: "", fieldOfStudy: "" });
    setEditingEduIndex(null);
    setEduError("");
  };

  const deleteEdu = async (index) => {
    const updatedEdu = userProfile.education.filter((_, i) => i !== index);
    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      education: updatedEdu,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const openEditEdu = (edu, index) => {
    setEduInput(edu);
    setEditingEduIndex(index);
    setEduError("");
    setEduModal(true);
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <div className={styles.avatarWrapper}>
                <img
                  src={`${baseURL}/${userProfile.userId.profilePic}`}
                  alt=""
                />
                <label className={styles.editPicLabel}>
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
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                    />
                  </svg>
                  <span>Edit Photo</span>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => updateProfilePicture(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div className={styles.profileCard}>
              <div className={styles.nameRow}>
                <h2>{userProfile.userId.name}</h2>
                <p>@{userProfile.userId.username}</p>
              </div>
              {editingBio ? (
                <div className={styles.editBioContainer}>
                  <textarea
                    className={styles.bioTextarea}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    rows={3}
                    placeholder="Write something about yourself..."
                  />
                  <div className={styles.editActions}>
                    <button className={styles.saveBtn} onClick={saveBio}>
                      Save
                    </button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setEditingBio(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.bioRow}>
                  <p className={styles.bioText}>
                    {userProfile.bio || "No bio yet."}
                  </p>
                  <button
                    className={styles.editIconBtn}
                    onClick={() => setEditingBio(true)}
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
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className={styles.topRow}>
              <div className={styles.historySection}>
                <div className={styles.historySectionHeader}>
                  <h4>Work History</h4>
                  <button
                    className={styles.addBtn}
                    onClick={() => {
                      setWorkInput({ company: "", position: "", years: "" });
                      setEditingWorkIndex(null);
                      setWorkError("");
                      setWorkModal(true);
                    }}
                  >
                    + Add
                  </button>
                </div>
                {(!userProfile.pastWork ||
                  userProfile.pastWork.length === 0) && (
                  <p className={styles.emptyText}>No work history added.</p>
                )}
                {userProfile.pastWork?.map((work, index) => (
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
                      <p className={styles.historyTertiary}>
                        {work.years} years
                      </p>
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        className={styles.editIconBtn}
                        onClick={() => openEditWork(work, index)}
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                          />
                        </svg>
                      </button>
                      <button
                        className={styles.deleteIconBtn}
                        onClick={() => deleteWork(index)}
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
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.historySection}>
                <div className={styles.historySectionHeader}>
                  <h4>Education</h4>
                  <button
                    className={styles.addBtn}
                    onClick={() => {
                      setEduInput({ school: "", degree: "", fieldOfStudy: "" });
                      setEditingEduIndex(null);
                      setEduError("");
                      setEduModal(true);
                    }}
                  >
                    + Add
                  </button>
                </div>
                {(!userProfile.education ||
                  userProfile.education.length === 0) && (
                  <p className={styles.emptyText}>No education added.</p>
                )}
                {userProfile.education?.map((edu, index) => (
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
                      <p className={styles.historyTertiary}>
                        {edu.fieldOfStudy}
                      </p>
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        className={styles.editIconBtn}
                        onClick={() => openEditEdu(edu, index)}
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                          />
                        </svg>
                      </button>
                      <button
                        className={styles.deleteIconBtn}
                        onClick={() => deleteEdu(index)}
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
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.historySection}>
              <div className={styles.historySectionHeader}>
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
          </div>
        )}

        {workModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setWorkModal(false)}
          >
            <div
              className={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>{editingWorkIndex !== null ? "Edit Work" : "Add Work"}</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setWorkModal(false)}
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
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className={styles.modalBody}>
                {workError && <p className={styles.errorText}>{workError}</p>}
                <input
                  className={styles.formInput}
                  placeholder="Company"
                  value={workInput.company}
                  onChange={(e) =>
                    setWorkInput({ ...workInput, company: e.target.value })
                  }
                />
                <input
                  className={styles.formInput}
                  placeholder="Position"
                  value={workInput.position}
                  onChange={(e) =>
                    setWorkInput({ ...workInput, position: e.target.value })
                  }
                />
                <input
                  className={styles.formInput}
                  placeholder="Years (e.g. 2)"
                  value={workInput.years}
                  type="number"
                  min="0"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || parseFloat(val) >= 0)
                      setWorkInput({ ...workInput, years: val });
                  }}
                />
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setWorkModal(false)}
                >
                  Cancel
                </button>
                <button className={styles.saveBtn} onClick={saveWork}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {eduModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setEduModal(false)}
          >
            <div
              className={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>
                  {editingEduIndex !== null
                    ? "Edit Education"
                    : "Add Education"}
                </h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setEduModal(false)}
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
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className={styles.modalBody}>
                {eduError && <p className={styles.errorText}>{eduError}</p>}
                <input
                  className={styles.formInput}
                  placeholder="School"
                  value={eduInput.school}
                  onChange={(e) =>
                    setEduInput({ ...eduInput, school: e.target.value })
                  }
                />
                <input
                  className={styles.formInput}
                  placeholder="Degree"
                  value={eduInput.degree}
                  onChange={(e) =>
                    setEduInput({ ...eduInput, degree: e.target.value })
                  }
                />
                <input
                  className={styles.formInput}
                  placeholder="Field of Study"
                  value={eduInput.fieldOfStudy}
                  onChange={(e) =>
                    setEduInput({ ...eduInput, fieldOfStudy: e.target.value })
                  }
                />
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setEduModal(false)}
                >
                  Cancel
                </button>
                <button className={styles.saveBtn} onClick={saveEdu}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
