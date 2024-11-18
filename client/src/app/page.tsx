"use client";

// REACT/NEXT LIBS
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "@/redux/slices/userSlice";

// COMPONENTS
import Button from "@/components/Button";
import GoogleIcon from "@mui/icons-material/Google";
import PageLoader from "./loading";

// MISC
import styles from "@/styles/page.module.css";
import { images } from "@/constants";
import { motion } from "framer-motion";
import { RootState } from "@/redux/store";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwtToken = params.get("token");
    const userId = params.get("userId")

    if (jwtToken) {
      dispatch(userActions.login({ userId: userId, token: jwtToken}))
      router.push("/explore");
    } else {
      setToken("");
    }
  }, []);

  const loginWithGoogle = async () => {
    try {
      window.location.href = "http://localhost:4000/api/auth/google";
    } catch (error) {
      console.log(error);
    }
  };

  if(token == null) {
    return <PageLoader />
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <div className={styles.page}>
        {/* Background Layout */}
        <div className={styles.background}>
          <Image
            src={images.backgroundImage}
            objectFit="cover"
            loading="lazy"
            layout="fill"
            alt="background"
          />
          <div className={styles.blackOverlay} />
        </div>

        {/* Main Content */}
        <div className={styles.mainContainer}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <Link href={"/"}>
              <Image
                src={images.accentLogo}
                className={styles.logoImage}
                width={1000}
                height={1000}
                loading="lazy"
                alt="NetClip"
              />
            </Link>
          </div>

          {/* Info Content */}
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "easeOut", duration: 1 }}
            className={styles.infoContainer}
          >
            <h1 className={styles.title}>Welcome to NetClip Movies</h1>
            <p className={styles.infoDescription}>
              Smooth and swift movie streaming for your busy schedule. Set
              reminders to watch your favourite movies later.
            </p>
            <Button
              text="Continue with Google"
              type="white-btn"
              onClick={loginWithGoogle}
              icon={<GoogleIcon className={styles.googleIcon} />}
            />
          </motion.div>
        </div>
      </div>
    </Suspense>
  );
}
