"use client";

// REACT/NEXT LIBS
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";

// COMPONENTS
import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import PageLoader from "../loading";

// MISC
import styles from "@/styles/pages/explore.module.css";
import { images } from "@/constants";
import { RootState } from "@/redux/store";
import { fetchUser } from "@/utils/handlers";
import { userActions } from "@/redux/slices/userSlice";

const ExplorePage = () => {
  const stateUser = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);

  const fetchUserDetails = async () => {
    const { user, error } = await fetchUser(
      stateUser.id,
      stateUser.accessToken
    );
    if (error || !user) {
      router.push("/");
    }
    setUserDetails(user);
    dispatch(
      userActions.setUser({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        photoUrl: user.photoUrl,
      })
    );
    setLoadingPage(false);
  };

  useEffect(() => {
    if (!stateUser.id) {
      setLoadingPage(false);
      router.push("/");
    } else {
      fetchUserDetails();
    }
  }, []);

  if (loadingPage) {
    return <PageLoader />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.dashboardHeader}>
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

        {/* Search and options */}
        <div className={styles.searchAndOptions}>
          {/* Search */}
          <div className={styles.searchBar}>
            <SearchIcon className={styles.searchIcon} />
            <input className={styles.searchBarInput} type="text" placeholder="Search movies or shows" />
            <KeyboardVoiceOutlinedIcon className={styles.searchIcon} />
          </div>
          {/* Options */}
          <div className={styles.optionsContainer}>
            <NotificationsNoneOutlinedIcon className={styles.optionsIcon} />
            {/* Profile section */}
            <button type="button">
              <div className={styles.profileContainer}>
                <div className={styles.profileImgContainer}>
                  <Image
                    src={userDetails.photoUrl}
                    alt={userDetails.firstname + " " + userDetails.lastname}
                    width={1000}
                    height={1000}
                    className={styles.profileImage}
                  />
                </div>
                <h4 className={styles.profileGreeting}>Hi, {userDetails.firstname}</h4>
                <ExpandMoreOutlinedIcon className={styles.dropDownIcon} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
