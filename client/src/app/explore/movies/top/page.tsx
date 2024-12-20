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
import { getTopMovies } from "@/utils/handlers";
import { SearchedMovie, TopMovie } from "@/types";

const SearchResultPage = () => {
  const params = useParams();
  const query = params.query as string;
  const [movieResult, setMovies] = useState<TopMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: any) => state.user);

  const getSearchResults = async () => {
    const { movies, error } = await getTopMovies(user.accessToken);
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
      <h1 className={styles.textHeader}>Top Movies</h1>
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
              description: movie.description,
              imdbId: movie.imdbid,
              rating: movie.rating,
              genre: movie.genre,
            };
            return <MovieCard key={movie.id} movie={movieData} />;
          })
        )}
      </div>
    </div>
  );
};

export default isAuth(SearchResultPage);
