"use client";

// REACT/NEXT LIBS
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// COMPONENTS
import SearchBoxHeader from "@/components/SearchBoxHeader";
import DesktopNav from "@/components/DesktopNav";
import MovieCard from "@/components/MovieCard";
import { Blocks } from "react-loader-spinner";

// MISC
import styles from "@/styles/pages/movielist.module.css";
import { useSelector } from "react-redux";
import isAuth from "@/containers/IsAuth";
import { searchMovies } from "@/utils/handlers";
import { SearchedMovie } from "@/types";

const SearchResultPage = () => {
  const params = useParams();
  const query = params.query as string;
  const [movieResult, setMovies] = useState<SearchedMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: any) => state.user);

  const getSearchResults = async () => {
    const { movies, error } = await searchMovies(user.accessToken, query);
    if (error) {
      console.error(error);
      return;
    }
    if (!movies) {
      return;
    }
    setMovies(movies);
    setLoading(false);
  };

  useEffect(() => {
    getSearchResults();
  }, []);

  return (
    <div className={styles.mainPage}>
      <SearchBoxHeader userDetails={user} />
      <DesktopNav />
      <h1 className={styles.textHeader}>Results for: {query}</h1>
      <div className={styles.movieListContainer}>
        {loading ? (
          <Blocks
            height="80"
            width="80"
            color="#E70830"
            ariaLabel="blocks-loading"
            wrapperClass="blocks-wrapper"
            visible={true}
          />
        ) : (
          movieResult.map((movie) => {
            const movieData = {
              title: movie.title,
              image: movie.image,
              year: movie.year,
              imdbId: movie.id,
              imdb_link: movie.imdb,
            };
            return <MovieCard key={movie.id} movie={movieData} />;
          })
        )}
      </div>
    </div>
  );
};

export default isAuth(SearchResultPage);
