"use client";

// REACT/NEXT LIBS
import Slider from "react-slick";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// COMPONENTS
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// MISC
import styles from "@/styles/containers/movieslider.module.css"

const CardCarousel = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoPlay: true,
    prevArrow: <ArrowBackIosNewIcon />,
    nextArrow: <ArrowForwardIosIcon />,
  };
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      partialVisibilityGutter: 40,
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  return <div className={styles.sliderContainer}><Carousel responsive={responsive}>
    {children}
  </Carousel></div>;
};

export default CardCarousel;
