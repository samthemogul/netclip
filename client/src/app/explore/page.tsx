"use client";

// REACT/NEXT LIBS
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";

// COMPONENTS
import isAuth from "@/containers/IsAuth";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckIcon from "@mui/icons-material/Check";
import PageLoader from "../loading";
import DesktopNav from "@/components/DesktopNav";
import Genre from "@/components/Genre";
import TopMovies from "@/containers/TopMovies";
import SearchBoxHeader from "@/components/SearchBoxHeader";
import FeaturedHero from "@/components/FeaturedHero";

// MISC
import styles from "@/styles/pages/explore.module.css";
import { motion } from "framer-motion";
import { RootState } from "@/redux/store";
import {
  fetchUser,
  getTopMovies,
  getMovieRecommendations,
  addMovieToWatchList,
} from "@/utils/handlers";
import { userActions } from "@/redux/slices/userSlice";
import { IMovie, TopMovie } from "@/types";
import Button from "@/components/Button";

const ExplorePage = () => {
  const stateUser = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [movies, setMovies] = useState<TopMovie[]>([]);
  const [recommendations, setRemmendations] = useState<IMovie[]>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [addingFeatureToWatch, setAddingFeatureToWatch] =
    useState<boolean>(false);
  const [addedFeatured, setAddedFeatured] = useState<boolean>(false);

  const fetchUserAndMovieDetails = async () => {
    const { user, error } = await fetchUser(
      stateUser.id,
      stateUser.accessToken
    );
    if (error || !user) {
      dispatch(userActions.logout());
      router.push("/");
      return;
    }
    const movieResults = await getTopMovies(stateUser.accessToken);
    setMovies(movieResults.movies as TopMovie[]);
    const recommendationResults = await getMovieRecommendations(
      stateUser.id,
      stateUser.accessToken
    );
    setRemmendations(recommendationResults.recommendations as IMovie[]);
    setUserDetails(user);
    dispatch(
      userActions.setUser({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        photoUrl: user.photoUrl,
      })
    );
    setLoadingPage(false);
  };

  const addFeaturedToWatchList = async () => {
    const featuredMovie = movies[0];
    const payload = {
      title: featuredMovie.title,
      description: featuredMovie.description,
      image: featuredMovie.image,
      year: featuredMovie.year.toString(),
      imdbId: featuredMovie.imdbid,
      genres: featuredMovie.genre,
      rating: featuredMovie.rating,
    };
    if (!addedFeatured) {
      setAddedFeatured(true);
      setAddingFeatureToWatch(true);
      const waitlistResult = await addMovieToWatchList(
        stateUser.id,
        stateUser.accessToken,
        payload
      );
      if (waitlistResult.error) {
        console.error(waitlistResult.error);
        return;
      }
    }
    setAddingFeatureToWatch(false);
  };

  const goToMovie = (imdbId: string) => {
    router.push(`/explore/movies/${imdbId}`);
  };

  useEffect(() => {
    if (!stateUser.id) {
      setLoadingPage(false);
      router.push("/");
    } else {
      fetchUserAndMovieDetails();
    }
  }, []);

  if (loadingPage || !userDetails) {
    return <PageLoader />;
  }

  return (
    <div className={styles.main}>
      <SearchBoxHeader userDetails={userDetails} />

      {/* Desktop Navigation */}
      <div className={styles.navWrapper}>
        <DesktopNav />
      </div>

      {/* Featured Movie */}
      {movies && movies[0] ? (
        <div className={styles.featuredMovieContainer}>
          <FeaturedHero user={stateUser} movie={movies[0]} />
          <div className={styles.featuredMovieDetails}>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className={styles.featuredMovieTitle}
            >
              {movies[0].title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className={styles.imdbAndYear}
            >
              <div className={styles.imdbRating}>
                <div className={styles.imdbLogo}>
                  <p className={styles.imdbLogoText}>IMDb</p>
                </div>
                <p className={styles.ratingText}>{movies[0].rating}</p>
              </div>
              <p className={styles.ratingText}>{movies[0].year}</p>
            </motion.div>

            {/* ACtions */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className={styles.featuredButtonsContainer}
            >
              <Button
                onClick={() => goToMovie(movies[0].imdbid)}
                text={"See Details"}
                type={"white-btn"}
              />
              <Button
                icon={
                  addedFeatured ? (
                    <CheckIcon className={styles.transIcon} />
                  ) : addingFeatureToWatch ? (
                    <HourglassBottomIcon className={styles.transIcon} />
                  ) : (
                    <AddRoundedIcon className={styles.transIcon} />
                  )
                }
                onClick={addFeaturedToWatchList}
                text={addedFeatured ? "Added" : "Add to Watchlist"}
                type={"glass-btn"}
              />
            </motion.div>
          </div>
        </div>
      ) : null}

      {/* Top Movies */}
      <div className={styles.topMoviesWrapper}>
        <div className={styles.pageSubTitleContainer}>
          <h1 className={styles.pageSubTitle}>Top Movies</h1>
          <Link href={"/explore/movies/top"} className={styles.pageSubTitleBtn}>
            See More
          </Link>
        </div>

        <TopMovies movies={movies ? movies.slice(1, 9) : []} />
      </div>

      {/* Recommended Movies */}
      <div className={styles.topMoviesWrapper}>
        <div className={styles.pageSubTitleContainer}>
          <h1 className={styles.pageSubTitle}>For You</h1>
          <Link href={"/explore/movies/for-you"} className={styles.pageSubTitleBtn}>
            See More
          </Link>
        </div>
        <TopMovies movies={recommendations ? recommendations.slice(0, 10) : []} />
      </div>
    </div>
  );
};

export default isAuth(ExplorePage);
