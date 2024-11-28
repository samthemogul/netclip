"use client";

// REACT/NEXT LIBS

// COMPONENTS


// MISC
import styles from "@/styles/containers/movieslider.module.css"

const CardCarousel = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className={styles.sliderContainer}>
    {children}</div>;
};

export default CardCarousel;
