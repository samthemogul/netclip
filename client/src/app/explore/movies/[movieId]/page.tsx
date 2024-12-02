"use client";

// REACT/NEXT LIBS
import Image from "next/image";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// COMPONENTS
import DesktopNav from "@/components/DesktopNav";
import SearchBoxHeader from "@/components/SearchBoxHeader";
import PageLoader from "@/app/loading";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckIcon from '@mui/icons-material/Check';

// MISC
import isAuth from "@/containers/IsAuth";
import styles from "@/styles/pages/moviedetails.module.css";
import { RootState } from "@/redux/store";
import { IUser } from "@/types";
import { getMovie } from "@/utils/handlers";
import Genre from "@/components/Genre";
import Button from "@/components/Button";

const MoviePage = () => {
  const user = useSelector((state: RootState) => state.user);
  const params = useParams();
  const [loadingMovie, setLoadingMovie] = useState<boolean>(true);
  const [movie, setMovie] = useState<any>(null);
  const [addedToWatchList, setAddedToWatchList] = useState<boolean>(false);

  const getMovieDetails = async () => {
    try {
      setLoadingMovie(true);
      const { movie, error } = await getMovie(
        user.accessToken,
        params.movieId as string
      );
      if (error) return;
      setMovie(movie);
      setLoadingMovie(false);
    } catch (error) {
      console.log(error);
      setLoadingMovie(false);
    }
  };

  const addToWatchList = () => {
    setAddedToWatchList(true);
  };

  useEffect(() => {
    getMovieDetails();
  }, []);

  if (loadingMovie) {
    return <PageLoader />;
  }

  return (
    <div>
      <SearchBoxHeader userDetails={user} />
      <DesktopNav />
      <div className={styles.movieDetailContainer}>
        <video width="100%" height="700" autoPlay loop preload="auto">
          <source src={movie.videos[0].url} type="video/mp4" />
          <track kind="subtitles" srcLang="en" label="English" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.heroContainer}>
          {/* <div className={styles.movieImageContainer}>
            <div className={styles.imageWrapper}>
              <Image
                src={movie.image}
                width={1000}
                height={1000}
                alt={movie.title}
                className={styles.movieImage}
              />
            </div>
          </div> */}
          <div className={styles.movieDetails}>
            <h1 className={styles.movieTitle}>{movie.title}</h1>
            <div className={styles.buttonContainer}>
              <Button
                icon={
                  <PlayArrowRoundedIcon className={styles.transIconBlack} />
                }
                onClick={() => {}}
                text={"Watch Movie"}
                type={"white-btn"}
              />
              <Button
                icon={ addedToWatchList ? <CheckIcon className={styles.transIcon} /> : <AddRoundedIcon className={styles.transIcon} />}
                onClick={addToWatchList}
                text={ addedToWatchList ? "Added" : "Add to Watchlist"}
                type={"glass-btn"}
              />
            </div>
          </div>
        </div>
        <div className={styles.mainBody}>
          <p className={styles.movieDescription}>{movie.description}</p>
          <div className={styles.genres}>
            {movie.genres.map((g: any, index: number) => (
              <Genre key={index} genre={g} />
            ))}
          </div>
          <div className={styles.imdbAndYearInfo}>
            <div className={styles.imdbRating}>
              <div className={styles.imdbLogo}>
                <p className={styles.imdbLogoText}>IMDb</p>
              </div>
              <p className={styles.ratingText}>{movie.rating}</p>
            </div>
            <p className={styles.ratingText}>{movie.releaseYear}</p>
          </div>
          <h4 className={styles.castHeader}>Cast</h4>
          <div className={styles.casts}>
            {movie.actors.map((actor: any) => {
              if (actor.node.name.primaryImage === null) {
                return null;
              } else {
                return (
                  <div className={styles.actor}>
                    <Image
                      className={styles.actorImage}
                      src={actor.node.name.primaryImage.url}
                      alt={actor.node.name.nameText.text}
                      width={100}
                      height={100}
                    />
                    <p className={styles.actorName}>
                      {actor.node.name.nameText.text}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default isAuth(MoviePage);
