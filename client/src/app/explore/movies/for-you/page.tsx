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
import { getMovieRecommendations } from "@/utils/handlers";
import { IMovie } from "@/types";

const SearchResultPage = () => {
  const params = useParams();
  const query = params.query as string;
  const [movieResult, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: any) => state.user);

  const getSearchResults = async () => {
    const { recommendations, error } = await getMovieRecommendations(user.id, user.accessToken);
    if (error) {
      console.error(error);
      return;
    }
    if (!recommendations) {
      return;
    }
    setMovies(recommendations);
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
              imdbId: movie.imdbId,
              rating: movie.rating,
              genre: movie.genre,
            };
            return <MovieCard key={movie.imdbId} movie={movieData} />;
          })
        )}
      </div>
    </div>
  );
};

export default isAuth(SearchResultPage);
