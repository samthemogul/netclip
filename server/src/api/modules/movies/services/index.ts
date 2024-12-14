import axios from "axios";
import { ProviderResponse } from "../../../../types";
import { redisService } from "../../../../utils/caches/redis";
import logger from "../../../../libs/loggers/winston";
import { IMovie, TopMovie } from "../../../../types/movie";
import { ServerError } from "../../../../libs/handlers/error";
import UserRepository from "../../user/repository";
import MovieListService from "../../watchlist/services";
import { getMovieModel } from "../../../../config/database/mongoose/movie.model";

const userRepository = new UserRepository();

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
        return { data: cachedMovie, error: null };
      } else {
        const response = await axios.get(
          `https://imdb146.p.rapidapi.com/v1/title/?id=${imdbId}`,
          {
            headers: {
              "x-rapidapi-key": process.env.RAPID_API_KEY,
              "x-rapidapi-host": "imdb146.p.rapidapi.com",
            },
          }
        );
        if (response.status === 200) {
          const movie = response.data;
          const movieToCache = {
            id: movie.id,
            title: movie.titleText.text,
            releaseYear: movie.releaseYear.year,
            rating: movie.ratingsSummary.aggregateRating,
            image: movie.primaryImage.url,
            videos:
              movie.primaryVideos.edges[0]?.node?.playbackURLs?.filter(
                (pUrl: any) => pUrl.videoMimeType == "MP4"
              ) || [],
            description: movie.plot.plotText?.plainText || null,
            actors: movie.cast.edges.slice(0, 5) || [],
            genres: movie.genres.genres.map((genre: any) => genre.text),
          };
          setImmediate(async () => {
            try {
              await redisService.set(
                `movie:${imdbId}`,
                JSON.stringify(movieToCache)
              );
              await redisService.setExpirationTime(
                `movie:${imdbId}`,
                60 * 60 * 24
              );
            } catch (error) {
              logger.error("Failed to cache movie");
            }
          });
          return { data: movieToCache, error: null };
        } else {
          error = new ServerError(error.message);
        }
      }
      return { data, error };
    } catch (error) {
      return { error: error.message, data: null };
    }
  }

  async getTrailer(vidoeId: string) {
    try {
      let error = null;
      let data = null;
      const getCachedMovieVideo = async (videoId: string) => {
        const pattern = `video:${videoId}`;
        const cachedVideo = await redisService.get(pattern);
        const cachedVideodata = JSON.parse(cachedVideo);
        return cachedVideodata;
      };
      const cachedVideo = await getCachedMovieVideo(vidoeId);
      if (cachedVideo) {
        return { data: cachedVideo, error: null };
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
                videoUrl: video.playbackURLs.find(
                  (url: any) => url.videoMimeType == "MP4"
                ).url,
                runtime: video.runtime.value,
              };
              await redisService.set(
                `video:${vidoeId}`,
                JSON.stringify(videoToCache)
              );
              await redisService.setExpirationTime(
                `video:${vidoeId}`,
                60 * 60 * 24
              );
            } catch (error) {
              logger.error("Failed to cache video");
            }
          });
          return { data: video, error: null };
        } else {
          error = new ServerError(error.message);
        }
      }
      return { data, error };
    } catch (error) {
      return { error: error.message, data: null };
    }
  }

  async getMovieVideo(userId: string, imdbId: string, videoId: string) {
    try {
      let error = null;
      let data = null;
      const getCachedMovieVideo = async (imdbId: string) => {
        const pattern = `movievideo:${imdbId}`;
        const cachedVideo = await redisService.get(pattern);
        const cachedVideodata = JSON.parse(cachedVideo);
        return cachedVideodata;
      };
      const cachedVideo = await getCachedMovieVideo(imdbId);
      if (cachedVideo) {
        return { data: cachedVideo, error: null };
      } else {
        const response = await axios.get(
          `https://imdb146.p.rapidapi.com/v1/video/?id=${videoId}`,
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
                videoUrl: video.playbackURLs.find(
                  (url: any) => url.videoMimeType == "MP4"
                ).url,
                runtime: video.runtime.value,
              };
              await redisService.set(
                `movievideo:${imdbId}`,
                JSON.stringify(videoToCache)
              );
              await redisService.setExpirationTime(
                `movievideo:${imdbId}`,
                60 * 60 * 24
              );
            } catch (error) {
              logger.error("Failed to cache video");
            }
          });
          return { data: video, error: null };
        } else {
          error = new ServerError(error.message);
        }
      }
      setImmediate(async () => {
        try {
          const { data, error } = await this.getMovie(imdbId);
          if (error) {
            throw new ServerError(error.message);
          }
          await userRepository.updateMoviesPreferences(userId, data.id);
          data.genres.forEach(async (genre: string) => {
            await userRepository.updateGenresPreferences(userId, genre);
          });
          await userRepository.updateLastWatch(userId);
        } catch (error) {
          logger.error("Failed to update last watch");
        }
      });
      return { data, error };
    } catch (error) {
      return { error: error.message, data: null };
    }
  }

  async searchMovies(query: string) {
    try {
      let error = null;
      let data = null;
      const response = await axios.get(
        `https://imdb-api12.p.rapidapi.com/search?query=${query}`,
        {
          headers: {
            "x-rapidapi-key": process.env.RAPID_API_KEY,
            "x-rapidapi-host": "imdb-api12.p.rapidapi.com",
          },
        }
      );
      if (response.status === 200) {
        const movies = response.data.results;
        console.log(movies)
        data = movies;
      }
      return { data, error };
    } catch (error) {
      return { error: error.message, data: null };
    }
  }
  async getMovieRecommendations(userId: string) {
    try {
      console.log("getting recommendations");
      let data = null;
      let error = null;
      const recommendations: IMovie[] = [];
      const userPreferences = await userRepository.getUserPreferences(userId);
      if (userPreferences) {
        const genres = userPreferences.genres.map((genre) => genre.name);
        const uniqueGenres = genres.filter(
          (genre, index) => genres.indexOf(genre) === index
        );
        const actors = userPreferences.favoriteActors;
        const watchedMovies = userPreferences.watchedMovies;
        if (genres.length > 0) {
          const genreRecommendations =
            await this.getRecommendationByGenres(uniqueGenres);
          recommendations.push(...genreRecommendations);
        }
        if (watchedMovies.length > 0) {
          const watchedRecommendations =
            await this.getRecommendationByWatchedMovies(watchedMovies);
          recommendations.push(...watchedRecommendations);
        }
        const collaborativeRecommendations =
          await this.getRecommendationByCollaborativeFiltering(userId);
        recommendations.push(...collaborativeRecommendations);
      }

      console.log("Recc: ", recommendations);
      if (recommendations.length > 0) {
        data = recommendations;
      } else {
        const cachedRecommendations = await redisService.get(
          `recommendations${userId}`
        );
        if (cachedRecommendations) {
          data = JSON.parse(cachedRecommendations);
        } else {
          console.log("Fetching reccomendations from api");
          const response = await axios.get(
            "https://imdb236.p.rapidapi.com/imdb/most-popular-movies",
            {
              headers: {
                "x-rapidapi-key": process.env.RAPID_API_KEY,
                "x-rapidapi-host": "imdb236.p.rapidapi.com",
              },
            }
          );
          if (response.status == 200) {
            const results = response.data.slice(10);
            const movies: IMovie[] = results.map((movie: any) => {
              return {
                imdbId: movie.id,
                title: movie.title,
                year: movie.startYear,
                rating: movie.averageRating,
                image: movie.primaryImage,
                description: movie.description,
                genre: [""],
              };
            });
            await redisService.set(
              `recommendations${userId}`,
              JSON.stringify(movies)
            );
            data = movies;
          } else {
            error = new ServerError(
              "Could not fetch fresh movie recommendations"
            );
          }
        }
      }

      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  private async getRecommendationByCollaborativeFiltering(userId: string) {
    try {
      const originalUserPreferences =
        await userRepository.getUserPreferences(userId);
      const similarUsers = await userRepository.getSimilarUsers(userId);

      const recommendedMovies: IMovie[] = [];
      for (const user of similarUsers) {
        const userPreferences = await userRepository.getUserPreferences(
          user.id
        );
        if (!userPreferences) {
          throw new ServerError("User preferences not found");
        }
        for (const movieId of userPreferences.watchedMovies.slice(5)) {
          if (!originalUserPreferences.watchedMovies.includes(movieId)) {
            const { data, error } = await this.getMovie(movieId);
            if (error) {
              throw new ServerError(error.message);
            }
            const movieObj = {
              imdbId: movieId,
              title: data.title,
              year: data.releaseYear,
              rating: data.rating,
              image: data.image,
              description: data.description,
              genre: data.genres,
            };
            recommendedMovies.push(movieObj);
          }
        }
      }
      return recommendedMovies;
    } catch (error) {
      throw error;
    }
  }

  private async getRecommendationByGenres(genres: string[]) {
    try {
      const moviesByGenres: IMovie[] = [];
      genres.forEach(async (genre) => {
        const movieModel = getMovieModel(genre);
        const movies = await movieModel.find();
        for (let i = 0; i <= 20; i++) {
          const movie = movies[i];
          moviesByGenres.push({
            imdbId: movie.movie_id,
            title: movie.movie_name,
            year: movie.year,
            rating: movie.rating.toString(),
            description: movie.description,
            genre: movie.genre,
            image: "",
          });
        }
      });
      // shuffle the moviesByGenres array
      for (let i = moviesByGenres.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = moviesByGenres[i];
        moviesByGenres[i] = moviesByGenres[j];
        moviesByGenres[j] = temp;
      }
      return moviesByGenres;
    } catch (error) {
      throw error;
    }
  }

  private async getRecommendationByActors(actors: string[]) {}
  private async getRecommendationByWatchedMovies(movies: string[]) {
    try {
      const similarMovies: IMovie[] = [];

      for (const movieId of movies.slice(10)) {
        const response = await axios.get(
          `https://movies-tv-shows-database.p.rapidapi.com/?movieid=${movieId}&page=1`,
          {
            headers: {
              "x-rapidapi-key": process.env.RAPID_API_KEY,
              "x-rapidapi-host": "movies-tv-shows-database.p.rapidapi.com",
              Type: "get-similar-movies",
            },
          }
        );
        if (response.status === 200) {
          const movies = response.data.movie_results.slice(5);
          movies.forEach(async (movie: any) => {
            const { data, error } = await this.getMovie(movie.imdb_id);
            if (error) {
              throw new ServerError(error.message);
            }
            const movieObj = {
              imdbId: movie.imdb_id,
              title: data.title,
              year: data.releaseYear,
              rating: data.rating,
              image: data.image,
              description: data.description,
              genre: data.genres,
            };
            similarMovies.push(movieObj);
          });
        }
      }
      return similarMovies;
    } catch (error) {
      throw error;
    }
  }
}

export default MovieService;
