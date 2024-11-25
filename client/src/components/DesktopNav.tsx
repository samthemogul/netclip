"use client";

// REACT/NEXT LIBS
import { useRouter } from "next/router";

// COMPONENTS
import Button from "./Button";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// MISC
import styles from "@/styles/components/nav.module.css";

const DesktopNav = () => {
  return (
    <div className={styles.deskNavContainer}>
      <Button
        icon={
          <ChairOutlinedIcon
            className={styles.navIcon}
          />
        }
        onClick={() => {}}
        type={"navbutton"}
      />
      <Button
        icon={
          <LiveTvOutlinedIcon
            className={styles.navIcon}
          />
        }
        onClick={() => {}}
        type={"navbutton"}
      />
      <Button
        icon={
          <HistoryOutlinedIcon
            className={styles.navIcon}
          />
        }
        onClick={() => {}}
        type={"navbutton"}
      />
      <Button
        icon={
          <SettingsOutlinedIcon
            className={styles.navIcon}
          />
        }
        onClick={() => {}}
        type={"navbutton"}
      />
    </div>
  );
};

export default DesktopNav;
