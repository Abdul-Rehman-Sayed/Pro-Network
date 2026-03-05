import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect with professionals in your field</p>
            <p>A platform for building meaningful professional relationships</p>
            <div
              onClick={() => router.push("/login")}
              className={styles.joinButton}
            >
              <p>Join Now</p>
            </div>
          </div>
          <div className={styles.mainContainer_right}>
            <img src="/images/hero.png" alt="" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
