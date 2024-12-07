import prisma from "../../../../config/database/prisma";
import { ServerError } from "../../../../libs/handlers/error";

class MovieListsRepository {
  private watchListModel = prisma.watchList;
  private watchHistoryModel = prisma.watchHistory;

  createNewWatchList = async (userId: string) => {
    try {
      const userWatchlist = await prisma.$transaction(
        async (prisma) => {
          const existingUserWatchList = await prisma.watchList.findUnique({
            where: { userId },
          });
          if (existingUserWatchList) {
            return existingUserWatchList;
          }
          return prisma.watchList.create({
            data: {
              userId,
            },
          });
        },
        { timeout: 30000 }
      );
      return userWatchlist;
    } catch (error) {
      console.log(error);
      throw new ServerError("Failed to create new watchlist");
    }
  };

  createNewWatchHistory = async (userId: string) => {
    try {
      const userWatchHistory = await prisma.$transaction(
        async (prisma) => {
          const existingUserWatchHistory = await prisma.watchHistory.findUnique({
            where: { userId },
          });
          if (existingUserWatchHistory) {
            return existingUserWatchHistory;
          }
          return prisma.watchHistory.create({
            data: {
              userId,
            },
          });
        },
        { timeout: 30000 }
      );
      return userWatchHistory;
    } catch (error) {
      console.log(error);
      throw new ServerError("Failed to create new watchhistory");
    }
  };

  getWatchListMovies = async (userId: string) => {
    try {
      const userWatchlistMovies = await prisma.$transaction(async (prisma) => {
        const existingUserWatchList = await prisma.watchList.findUnique({
          where: { userId },
        });
        if (!existingUserWatchList) {
          throw new ServerError("User does not have a watchlist");
        }
        const watchListMovies = await prisma.watchList.findUnique({
          where: { userId },
          include: {
            movies: true,
          },
        });
        return watchListMovies;
      });
      return userWatchlistMovies;
    } catch (error) {
      return null;
    }
  };

  getWatchHistoryMovies = async (userId: string) => {
    try {
      const userWatchHistoryMovies = await prisma.$transaction(
        async (prisma) => {
          const existingUserWatchHistory = prisma.watchHistory.findUnique({
            where: { userId },
          });
          if (!existingUserWatchHistory) {
            throw new ServerError("User does not have watch history");
          }
          const watchHistoryMovies = await prisma.watchHistory.findUnique({
            where: { userId },
            include: {
              movies: true,
            },
          });
          return watchHistoryMovies;
        }
      );
      return userWatchHistoryMovies;
    } catch (error) {}
  };
}
export default MovieListsRepository;
