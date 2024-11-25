"use client";

// REACT/NEXT LIBS
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";

// COMPONENTS
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PageLoader from "../loading";
import DesktopNav from "@/components/DesktopNav";
import Genre from "@/components/Genre";
import TopMovies from "@/containers/TopMovies";
import SearchBoxHeader from "@/components/SearchBoxHeader";

// MISC
import styles from "@/styles/pages/explore.module.css";
import { RootState } from "@/redux/store";
import { fetchUser, getTopMovies } from "@/utils/handlers";
import { userActions } from "@/redux/slices/userSlice";
import { TopMovie } from "@/types";
import Button from "@/components/Button";

const ExplorePage = () => {
  const stateUser = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [movies, setMovies] = useState<TopMovie[] | null>(null);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);

  const fetchUserAndMovieDetails = async () => {
    const { user, error } = await fetchUser(
      stateUser.id,
      stateUser.accessToken
    );
    if (error || !user) {
      router.push("/");
      return 
    }  
    const movieResults = await getTopMovies(stateUser.accessToken);
    setMovies(movieResults.movies);
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
          <Image
            src={movies[0].big_image}
            alt={movies[0].title}
            width={1000}
            height={1000}
            className={styles.featuredMovieImage}
          />
          <div className={styles.featuredMovieDetails}>
            <h1 className={styles.featuredMovieTitle}>{movies[0].title}</h1>
            <div className={styles.imdbAndYear}>
              <div className={styles.imdbRating}>
                <div className={styles.imdbLogo}>
                  <p className={styles.imdbLogoText}>IMDb</p>
                </div>
                <p className={styles.ratingText}>{movies[0].rating}</p>
              </div>
              <p className={styles.ratingText}>{movies[0].year}</p>
            </div>
            <p className={styles.featuredMovieDescripton}>
              {movies[0].description}
            </p>
            {/* Genres */}
            <div className={styles.genre}>
              {movies[0].genre.map((g, index) => (
                <Genre key={index} genre={g} />
              ))}
            </div>
            {/* ACtions */}
            <div className={styles.featuredButtonsContainer}>
              <Button icon={<PlayArrowRoundedIcon />} onClick={() => {}} text={"See Details"} type={"white-btn"}/>
              <Button icon={<AddRoundedIcon className={styles.transIcon} />} onClick={() => {}} text={"Add to Watchlist"} type={"glass-btn"}/>
            </div>
          </div>
        </div>
      ) : null}
        
        {/* Top Movies */}
        <div className={styles.topMoviesWrapper}>
            <h1 className={styles.pageSubTitle}>Top Movies</h1>
            <TopMovies movies={movies ? movies.slice(1, 9) : []} />
        </div>

        {/* Recommended Movies */}
        <div className={styles.topMoviesWrapper}>
            <h1 className={styles.pageSubTitle}>For You</h1>
            <TopMovies movies={movies ? movies.slice(9, 20) : []} />
        </div>
    </div>
  );
};

export default ExplorePage;
