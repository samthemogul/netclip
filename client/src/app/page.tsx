"use client";

// REACT/NEXT LIBS
import Image from "next/image";
import Link from "next/link";

// COMPONENTS
import Button from "@/components/Button";

// MISC
import styles from "@/styles/page.module.css";
import { images } from "@/constants";
import { motion } from "framer-motion";

export default function Home() {
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
          <Image
            src={images.accentLogo}
            className={styles.logoImage}
            width={1000}
            height={1000}
            loading="lazy"
            alt="NetClip"
          />
        </div>

        {/* Info Content */}
        <div className={styles.infoContainer}>
          <motion.h1
          initial={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0}}
          transition={{ type: "easeOut", duration: 1}}
          >Welcome to NetClip Movies</motion.h1>
        </div>
      </div>
    </div>
  );
}
