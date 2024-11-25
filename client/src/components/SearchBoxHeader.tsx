"use client"

// REACT/NEXT LIBS
import Link from "next/link";
import Image from "next/image";

// MISC
import styles from "@/styles/pages/explore.module.css";
import { images } from "@/constants";
import { IUser } from "@/types";

// COMPONENTS
import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

interface SearchBoxHeaderProps {
  userDetails: IUser;
}

const SearchBoxHeader = ({ userDetails } : SearchBoxHeaderProps) => {
  return (
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
            <input
              className={styles.searchBarInput}
              type="text"
              placeholder="Search movies or shows"
            />
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
                <h4 className={styles.profileGreeting}>
                  Hi, {userDetails.firstname}
                </h4>
                <ExpandMoreOutlinedIcon className={styles.dropDownIcon} />
              </div>
            </button>
          </div>
        </div>
      </div>
  )
}

export default SearchBoxHeader