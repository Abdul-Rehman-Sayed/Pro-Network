import React, { useEffect, useState } from "react";
import UserLayout from "./../../layout/UserLayout/index";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

const LoginComponent = () => {
  const authState = useSelector((state) => state.auth);
  const [isLoginMethod, setIsLoginMethod] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        router.push("/dashboard");
      }
    }
  }, [router]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLoginMethod, dispatch]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  });

  const handleRegister = () => {
    dispatch(registerUser({ username, name, email, password }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardTitle}>
              {isLoginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "#dc2626" : "#16a34a" }}>
              {authState.message}
            </p>
            <div className={styles.inputContainer}>
              {!isLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    className={styles.input}
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className={styles.input}
                    placeholder="Name"
                  />
                </div>
              )}
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className={styles.input}
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className={styles.input}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={isLoginMethod ? handleLogin : handleRegister}
                className={styles.button}
              >
                {isLoginMethod ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            <div className={styles.rightContent}>
              <h2 className={styles.rightTitle}>
                {isLoginMethod ? "New Here?" : "Welcome Back!"}
              </h2>

              <p className={styles.rightText}>
                {isLoginMethod
                  ? "Create an account to get started."
                  : "Already have an account?"}
              </p>

              <button
                onClick={() => setIsLoginMethod(!isLoginMethod)}
                className={styles.switchButton}
              >
                {isLoginMethod ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LoginComponent;
