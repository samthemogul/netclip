"use client"

import styles from "@/styles/page.module.css";
import { Blocks } from "react-loader-spinner";

const PageLoader = () => {
  return (
    <div className={styles.loaderPage}>
      <Blocks
        height="80"
        width="80"
        color="#E70830"
        ariaLabel="blocks-loading"
        wrapperClass="blocks-wrapper"
        visible={true}
      />
    </div>
  );
};

export default PageLoader;
