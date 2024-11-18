"use client";

// REACT/NEXT LIBS
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// COMPONENTS

// MISC
import styles from '@/styles/pages/explore.module.css'
import { images } from "@/constants";

const ExplorePage = () => {
  return (
    <div className={styles.main}>
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
    </div>
  );
};

export default ExplorePage;
