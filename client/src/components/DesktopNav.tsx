"use client";

// REACT/NEXT LIBS
import { usePathname, useRouter } from "next/navigation";

// COMPONENTS
import Button from "./Button";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// MISC
import styles from "@/styles/components/nav.module.css";

const DesktopNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const rootPath = pathname.split('/')[1]
  const isRootPath = pathname.split('/').length == 2 ? true : false;

  const goToHome = () => {
    router.push("/explore");
  }
  const goToWatchlist = () => {
    router.push("/watchlist");
  }
  const goToHistory = () => {
    router.push("/history");
  }
  const goToSettings = () => {
    router.push("/settings");
  }

  return (
    <div className={styles.deskNavContainer}>
      <Button
        icon={
          <ChairOutlinedIcon
            className={styles.navIcon}
          />
        }
        onClick={goToHome}
        type={rootPath  == "explore" && isRootPath ? "activenavbtn" : "navbutton"}
      />
      <Button
        icon={
          <LiveTvOutlinedIcon
            className={styles.navIcon}
          />
        }
        onClick={goToWatchlist}
        type={rootPath == "watchlist" && isRootPath ? "activenavbtn" : "navbutton"}
      />
      <Button
        icon={
          <HistoryOutlinedIcon
            className={styles.navIcon}
          />
        }
        onClick={goToHistory}
        type={rootPath == "history" && isRootPath ? "activenavbtn" : "navbutton"}
      />
      <Button
        icon={
          <SettingsOutlinedIcon
            className={styles.navIcon}
          />
        }
        onClick={goToSettings}
        type={rootPath == "settings" && isRootPath ? "activenavbtn" : "navbutton"}
      />
    </div>
  );
};

export default DesktopNav;
