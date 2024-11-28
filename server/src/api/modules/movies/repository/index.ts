import prisma from "../../../../config/database/prisma";
import { ServerError } from "../../../../libs/handlers/error";

class MovieRepository {
  private movieModel = prisma.movie;

  private getMovie = async ({
    title,
    description,
    year,
    imdbId,
    genres,
    rating,
  }: {
    title: string;
    description: string;
    year: string;
    imdbId: string;
    genres: string[];
    rating: string;
  }) => {
    try {
      const newMovie = await prisma.$transaction(async (prisma) => {
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
            year,
            imdbId,
            rating,
            genres: {
              connect: genreRecords.map((genre) => ({ id: genre.id })),
            },
          },
        });
        return newMovie;
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
    year,
    imdbId,
    genres,
    rating,
  }: {
    userId: string;
    title: string;
    description: string;
    year: string;
    imdbId: string;
    genres: string[];
    rating: string;
  }) => {
    try {
      const watchList = await prisma.$transaction(async (prisma) => {
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
        const updatedWatchList = await prisma.watchList.findUnique({
          where: { id: existingWatchList.id },
          include: {
            movies: true,
          },
        });
        return updatedWatchList;
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
    year,
    imdbId,
    genres,
    rating,
  }: {
    userId: string;
    title: string;
    description: string;
    year: string;
    imdbId: string;
    genres: string[];
    rating: string;
  }) => {
    try {
        const watchHistory = await prisma.$transaction(async (prisma) => {
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
                    datePlayed: new Date()
                }
            })
            await prisma.watchHistory.update({
              where: { id: existingHistory.id },
              data: {
                movies: {
                  connect: { id: existingMovie.id },
                },
              },
            });
            // return all the movies in the history
            const updatedWatchHistory = await prisma.watchList.findUnique({
              where: { id: existingHistory.id },
              include: {
                movies: true,
              },
            });
            return updatedWatchHistory;
          });
          return watchHistory;
    } catch (error) {
        
    }
  }
}

export default MovieRepository;
