import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "@/styles/pages/explore.module.css";
import { TopMovie } from "@/types";
import { getMovie } from "@/utils/handlers";

interface FMprops {
  movie: TopMovie;
  user: any;
}

const FeaturedHero = ({ movie, user }: FMprops) => {
  const [bannerTrailer, setBannerTrailer] = useState<string>("");
  useEffect(() => {
    const fetchTrailer = async () => {
      const results = await getMovie(user.accessToken, movie.imdbid);
      if (results.error) {
        console.error(results.error);
      } else {
        setBannerTrailer(results.movie.videos[0].url);
      }
    };
    fetchTrailer();
  }, []);
  return (
    <>
      {bannerTrailer ? (
        <video width="100%" height="700" autoPlay muted loop preload="auto">
          <source src={bannerTrailer} type="video/mp4" />
          <track kind="subtitles" srcLang="en" label="English" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Image
          src={movie.image}
          alt={movie.title}
          width={1000}
          height={1000}
          className={styles.featuredMovieImage}
        />
      )}
    </>
  );
};

export default FeaturedHero;
