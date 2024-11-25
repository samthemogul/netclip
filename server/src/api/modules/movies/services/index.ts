import axios from "axios";
import { ProviderResponse } from "../../../../types";
import { redisService } from "../../../../utils/caches/redis";
import logger from "../../../../libs/loggers/winston";
import { TopMovie } from "../../../../types/movie";
import { ServerError } from "../../../../libs/handlers/error";
import { release } from "os";

class MovieService {
  async getTopMovies(): Promise<ProviderResponse> {
    try {
      let data = null;
      let error = null;

      const getCachedTopMovies = async () => {
        const pattern = `topmovies`;

        let movies: TopMovie[] = [];
        const cachedMovies = await redisService.get(pattern);
        movies = JSON.parse(cachedMovies);
        return movies;
      };

      const cachedTopMovies = await getCachedTopMovies();
      if (cachedTopMovies && cachedTopMovies.length > 0) {
        return { data: cachedTopMovies, error: null };
      } else {
        const response = await axios.get(
          "https://imdb-top-100-movies.p.rapidapi.com/",
          {
            headers: {
              "x-rapidapi-key": process.env.RAPID_API_KEY,
              "x-rapidapi-host": "imdb-top-100-movies.p.rapidapi.com",
            },
          }
        );
        if (response.status === 200) {
          data = response.data;
          setImmediate(async () => {
            try {
              await redisService.set(
                "topmovies",
                JSON.stringify(response.data)
              );
              await redisService.setExpirationTime("topmovies", 60 * 60 * 24);
            } catch (error) {
              logger.error("Failed to cache top movies");
            }
          });
        } else {
          error = response.data;
        }
      }
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
  async getMovieSearchResults(query: string) {}

  async getMovie(imdbId: string) {
    try {
      let error = null;
      let data = null;
      const getCachedMovie = async (id: string) => {
        const pattern = `movie:${id}`;
        const cachedMovie = await redisService.get(pattern);
        return JSON.parse(cachedMovie);
      };
      const cachedMovie = await getCachedMovie(imdbId);
      if (cachedMovie) {
        return { data: cachedMovie, error: null};
      } else {
        const response = await axios.get(
          `https://imdb146.p.rapidapi.com//v1/title/?id=${imdbId}`,
          {
            headers: {
              "x-rapidapi-key": process.env.RAPID_API_KEY,
              "x-rapidapi-host":
                "imdb146.p.rapidapi.com",
            },
          }
        );
        if (response.status === 200) {
          const movie = response.data;
          const movieToCache = {
            id: movie.id,
            title: movie.titleText.text,
            releaseYear : movie.releaseYear.year,
            rating: movie.ratingsSummary.aggregateRating,
            image: movie.primaryImage.url,
            
          }
          setImmediate(async () => {
            try {
              await redisService.set(`movie:${imdbId}`, JSON.stringify(movie));
              await redisService.setExpirationTime(
                `movie:${imdbId}`,
                60 * 60 * 24
              );
            } catch (error) {
              logger.error("Failed to cache movie");
            }
          });
          return { data: movie, error: null};
        } else {
          error =  new ServerError(error.message);
        }
      }
      return { data, error}
    } catch (error) {
      return { error: error.message, data: null };
    }
  }

  async getTrailer(vidoeId: string) {
    try {
      let error = null;
      let data = null;
      const getCachedMovieVideo = async (videoId: string) => {
        const pattern = `video:${videoId}`
        const cachedVideo = await redisService.get(pattern);
        const cachedVideodata = JSON.parse(cachedVideo)
        return cachedVideodata
      }
      const cachedVideo = await getCachedMovieVideo(vidoeId);
      if(cachedVideo) {
        return { data: cachedVideo, error: null}
      } else {
        const response = await axios.get(
          `https://imdb146.p.rapidapi.com/v1/video/?id=${vidoeId}`,
          {
            headers: {
              "x-rapidapi-key": process.env.RAPID_API_KEY,
              "x-rapidapi-host": "imdb146.p.rapidapi.com",
            },
          }
        );
        if (response.status === 200) {
          const video = response.data;
          setImmediate(async () => {
            try {
              const videoToCache = {
                id: video.id,
                titleId: video.primaryTitle.id,
                titleText: video.primaryTitle.titleText.text,
                videoUrl: video.playbackURLs.find((url: any) => url.videoMimeType == "MP4").url,
                runtime: video.runtime.value
              }
              await redisService.set(`video:${vidoeId}`, JSON.stringify(videoToCache));
              await redisService.setExpirationTime(
                `video:${vidoeId}`,
                60 * 60 * 24
              );
            } catch (error) {
              logger.error("Failed to cache video");
            }
          });
          return { data: video, error: null};
        } else {
          error = new ServerError(error.message);
        }
      }
      return { data, error}
    } catch (error) {
      return { error: error.message, data: null };
    }
  }
}

export default MovieService;
