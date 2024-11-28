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

  const getMovieDetails = async () => {
    try {
      setLoadingMovie(true);
      const { movie, error } = await getMovie(
        user.accessToken,
        params.movieId as string
      );
      if (error) return;
      console.log(movie);
      setMovie(movie);
      setLoadingMovie(false);
    } catch (error) {
      console.log(error);
      setLoadingMovie(false);
    }
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
        <div className={styles.heroContainer}>
          <div className={styles.movieImageContainer}>
            <div className={styles.imageWrapper}>
              <Image
                src={movie.primaryImage.url}
                width={1000}
                height={1000}
                alt={movie.titleText.text}
                className={styles.movieImage}
              />
            </div>
          </div>
          <div className={styles.movieDetails}>
            <h1 className={styles.movieTitle}>{movie.titleText.text}</h1>
            <div className={styles.imdbAndYearInfo}>
              <div className={styles.imdbRating}>
                <div className={styles.imdbLogo}>
                  <p className={styles.imdbLogoText}>IMDb</p>
                </div>
                <p className={styles.ratingText}>
                  {movie.ratingsSummary.aggregateRating}
                </p>
              </div>
              <p className={styles.ratingText}>{movie.releaseYear.year}</p>
            </div>
            <p className={styles.movieDescription}>
              {movie.plot.plotText.plainText}
            </p>
            <div className={styles.genres}>
              {movie.genres.genres.map((g: any, index: number) => (
                <Genre key={index} genre={g.text} />
              ))}
            </div>
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
                icon={<AddRoundedIcon className={styles.transIcon} />}
                onClick={() => {}}
                text={"Add to Watchlist"}
                type={"glass-btn"}
              />
            </div>
            <p className={styles.movieDescription}>
              <strong>Duration: </strong>
              {movie.runtime.seconds / 60} mins
            </p>
            <h4 className={styles.castHeader}>Cast</h4>
            <div className={styles.casts}>
              {movie.cast.edges.slice(0, 5).map((actor: any) => {
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
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default isAuth(MoviePage);
