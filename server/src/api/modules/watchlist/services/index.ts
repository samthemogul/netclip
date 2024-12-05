import MovieRepository from "../../movies/repository";
import MovieListsRepository from "../repository";
import { ServerError } from "../../../../libs/handlers/error";

const movieRepository = new MovieRepository();
const movieListsRepository = new MovieListsRepository();

class MovieListService {
  async addMovieToWatchList(
    userId: string,
    title: string,
    description: string,
    year: string,
    imdbId: string,
    genres: string[],
    rating: string
  ) {
    try {
      let data = null;
      let error = null;
      const watchlist = await movieRepository.addMovieToWatchList({
        userId,
        title,
        description,
        year,
        imdbId,
        genres,
        rating,
      });
      if (watchlist) {
        data = watchlist;
      } else {
        error = new ServerError("Could not add movie to watchlist");
      }
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
  async removeMovieFromWatchList(userId: string, imdbId: string) {
    try {
      let data = null;
      let error = null;
      const watchlist = await movieRepository.removeMovieFromWatchlist({
        userId,
        imdbId,
      });
      if (watchlist) {
        data = watchlist;
      } else {
        error = new ServerError("Could not remove movie from watchlist");
      }
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
  async addMovieToHistory(
    userId: string,
    title: string,
    description: string,
    year: string,
    imdbId: string,
    genres: string[],
    rating: string
  ) {
    try {
      let data = null;
      let error = null;
      const history = await movieRepository.addMovieToUserHistory({
        userId,
        title,
        description,
        year,
        imdbId,
        genres,
        rating,
      });
      if (history) {
        data = history;
      } else {
        error = new ServerError("Could not add movie to history");
      }
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
  async getWatchList(userId: string) {
    try {
      let data = null;
      let error = null;
      const watchlist = await movieListsRepository.getWatchListMovies(userId);
      if (watchlist) {
        data = watchlist;
      } else {
        error = new ServerError("Could not retrieve watchlist");
      }
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
  async getHistory(userId: string) {
    try {
      let data = null;
      let error = null;
      const history = await movieListsRepository.getWatchHistoryMovies(userId);
      if (history) {
        data = history;
      } else {
        error = new ServerError("Could not retrieve history");
      }
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}

export default MovieListService;
