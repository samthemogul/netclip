import prisma from "../../../../config/database/prisma";
import { ServerError } from "../../../../libs/handlers/error";

class MovieRepository {
  private movieModel = prisma.movie;

  private getMovie = async ({
    title,
    description,
    image,
    year,
    imdbId,
    genres,
    rating,
  }: {
    title: string;
    description: string;
    image: string;
    year: string;
    imdbId: string;
    genres: string[];
    rating: string;
  }) => {
    try {
      const existingMovie = await prisma.movie.findUnique({
        where: { imdbId },
      });
      if (existingMovie) {
        return existingMovie;
      }
      const genreRecords = await Promise.all(
        genres.map(async (genreName) => {
          return await prisma.genre.upsert({
            where: { name: genreName },
            update: {},
            create: { name: genreName },
          });
        })
      );
      const newMovie = await prisma.movie.create({
        data: {
          title,
          description,
          image,
          year,
          imdbId,
          rating,
          genres: {
            connect: genreRecords.map((genre) => ({ id: genre.id })),
          },
        },
      });

      return newMovie;
    } catch (error) {
      console.error(error);
      throw new ServerError("Failed to create a new movie");
    }
  };

  addMovieToWatchList = async ({
    userId,
    title,
    description,
    image,
    year,
    imdbId,
    genres,
    rating,
  }: {
    userId: string;
    title: string;
    description: string;
    image: string;
    year: string;
    imdbId: string;
    genres: string[];
    rating: string;
  }) => {
    try {
      const existingWatchList = await prisma.watchList.findUnique({
        where: { userId },
      });
      if (!existingWatchList) {
        throw new ServerError(
          "Cannot add Movie to Watchlist: No existing watchlist"
        );
      }
      const existingMovie = await this.getMovie({
        title,
        description,
        image,
        year,
        imdbId,
        genres,
        rating,
      });
      if (!existingMovie) {
        throw new ServerError("Movie not found");
      }
      await prisma.watchList.update({
        where: { id: existingWatchList.id },
        data: {
          movies: {
            connect: { id: existingMovie.id },
          },
        },
      });
      // return all the movies in the watchlist
      const watchList = await prisma.watchList.findUnique({
        where: { id: existingWatchList.id },
        include: {
          movies: true,
        },
      });

      return watchList;
    } catch (error) {
      throw error;
    }
  };

  addMovieToUserHistory = async ({
    userId,
    title,
    description,
    image,
    year,
    imdbId,
    genres,
    rating,
  }: {
    userId: string;
    title: string;
    description: string;
    image: string;
    year: string;
    imdbId: string;
    genres: string[];
    rating: string;
  }) => {
    try {
      const existingHistory = await prisma.watchList.findUnique({
        where: { userId },
      });
      if (!existingHistory) {
        throw new ServerError(
          "Cannot add Movie to History: No existing history"
        );
      }
      const existingMovie = await this.getMovie({
        title,
        description,
        image,
        year,
        imdbId,
        genres,
        rating,
      });
      if (!existingMovie) {
        throw new ServerError("Movie not found");
      }
      await prisma.movie.update({
        where: { id: existingMovie.id },
        data: {
          datePlayed: new Date(),
        },
      });
      await prisma.watchHistory.update({
        where: { id: existingHistory.id },
        data: {
          movies: {
            connect: { id: existingMovie.id },
          },
        },
      });
      // return all the movies in the history
      const watchHistory = await prisma.watchList.findUnique({
        where: { id: existingHistory.id },
        include: {
          movies: true,
        },
      });

      return watchHistory;
    } catch (error) {
      throw error;
    }
  };

  removeMovieFromWatchlist = async ({
    userId,
    imdbId,
  }: {
    userId: string;
    imdbId: string;
  }) => {
    try {
      const watchList = await prisma.watchList.findUnique({
        where: {
          userId: userId,
        },
        include: {
          movies: true,
        },
      });
      if (!watchList) {
        throw new ServerError("Watchlist not found");
      }
      const existingMovie = await prisma.movie.findUnique({
        where: {
          imdbId: imdbId,
        },
      });
      if (!existingMovie) {
        throw new ServerError("Movie not found");
      }
      const movieInWatchlist = watchList.movies.find(
        (movie) => movie.imdbId === imdbId
      );

      if (!movieInWatchlist) {
        throw new ServerError("Movie is not in the watchlist");
      }
      // remove the movie from the watchlist
      return prisma.watchList.update({
        where: {
          userId: userId,
        },
        data: {
          movies: {
            disconnect: { id: existingMovie.id },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };
}

export default MovieRepository;
