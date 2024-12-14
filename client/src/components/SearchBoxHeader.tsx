"use client";

// REACT/NEXT LIBS
import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, KeyboardEvent, SetStateAction, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

// MISC
import styles from "@/styles/pages/explore.module.css";
import { images } from "@/constants";
import { IUser } from "@/types";
import { userActions } from "@/redux/slices/userSlice";
import { logoutUser, getStreak } from "@/utils/handlers";

// COMPONENTS
import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import { RootState } from "@/redux/store";

interface SearchBoxHeaderProps {
  userDetails: IUser;
}

const SearchBoxHeader = ({ userDetails }: SearchBoxHeaderProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [query, setQuery] = useState<string>("");
  const user = useSelector((state: RootState) => state.user);
  const [showDropdown, setShowDropDown] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  const logout = async () => {
    await logoutUser(user.accessToken);
    dispatch(userActions.logout());
    router.push("/");
  };
  const toggleDropDown = () => {
    setShowDropDown(!showDropdown);
  };
  const handleSubmit = () => {
    router.push(`/explore/movies/search/${query}`);
  };
  const getStreakCount = async () => {
    const { streak, error } = await getStreak(user.id, user.accessToken);
    if (error) return;
    if (streak == null) return;
    setStreakCount(streak);
  };
  useEffect(() => {
    getStreakCount();
  }, []);
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
          <button type="button" onClick={handleSubmit}>
            <SearchIcon className={styles.searchIcon} />
          </button>
          <input
            value={query}
            onChange={(ev) => handleSearchChange(ev)}
            onKeyDown={(ev) => handleKeyDown(ev)}
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
          <button type="button" onClick={toggleDropDown}>
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
          {showDropdown ? (
            <div className={styles.floatingDropdown}>
              <ul className={styles.floatingDropdownList}>
                <li className={styles.floatingDropdownItem}>
                  <div className={styles.streakContainer}>
                    <BoltIcon className={styles.boltIcon} />
                    <p className={styles.profileGreeting}>{streakCount}</p>
                  </div>
                </li>
                <li className={styles.floatingDropdownItem}>
                  <button
                    className={styles.dpButton}
                    type="button"
                    onClick={logout}
                  >
                    <p className={styles.profileGreeting}>Logout</p>
                  </button>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchBoxHeader;
