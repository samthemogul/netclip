"use client";

// REACT/NEXT LIBS
import Image from "next/image";
import Link from "next/link";

// COMPONENTS
import Button from "@/components/Button";
import GoogleIcon from '@mui/icons-material/Google';

// MISC
import styles from "@/styles/page.module.css";
import { images } from "@/constants";
import { motion } from "framer-motion";
import { authenticateUser } from "@/utils/handlers";
import axios from "axios"

export default function Home() {

  const loginWithGoogle = async () => {
    try {
      // const { user, error } = await authenticateUser()
      // if(error) {
      //   console.log(error)
      // }
      // if(!user) {
      //   console.log("User not authenticated")
      // } else {
      //   console.log(user)
      // }
      const res = await axios.get("https://netclip-server.onrender.com/api/auth/google", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res)
      const data = await res.data;
    } catch (error) {
      console.log(error)
    }
  }

  
  return (
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
  );
}
