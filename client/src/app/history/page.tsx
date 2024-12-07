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
import { getHistoryMovies } from "@/utils/handlers";
import { IMovie } from "@/types";

const SearchResultPage = () => {
  const params = useParams();
  const query = params.query as string;
  const [historyMovies, setHistoryMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: any) => state.user);

  const getSearchResults = async () => {
    const { history, error } = await getHistoryMovies(
      user.id,
      user.accessToken
    );
    if (error) {
      console.error(error);
      return;
    }
    if (!history) {
      return;
    }
    setHistoryMovies(history);
    setLoading(false);
  };

  useEffect(() => {
    getSearchResults();
  }, []);

  return (
    <div className={styles.mainPage}>
      <SearchBoxHeader userDetails={user} />
      <DesktopNav />
      <h1 className={styles.textHeader}>My History</h1>
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
        ) : historyMovies.length < 1 ? (
          <p className={styles.resultsText}>You've not watched any movie yet.</p>
        ) : (
            historyMovies.map((movie) => {
            const movieData = {
              title: movie.title,
              image: movie.image,
              year: movie.year,
              imdbId: movie.imdbId,
              rating: movie.rating,
              genre: movie.genre,
              description: movie.description,
            };
            return <MovieCard key={movie.imdbId} movie={movieData} />;
          })
        )}
      </div>
    </div>
  );
};

export default isAuth(SearchResultPage);
