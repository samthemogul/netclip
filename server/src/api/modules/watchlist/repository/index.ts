import prisma from "../../../../config/database/prisma";
import { ServerError } from "../../../../libs/handlers/error";

class MovieListsRepository {
  private watchListModel = prisma.watchList;
  private watchHistoryModel = prisma.watchHistory;

  createNewWatchList = async (userId: string) => {
    try {
      const userWatchlist = await prisma.$transaction(async (prisma) => {
        const existingUserWatchList = prisma.watchList.findUnique({
          where: { userId },
        });
        if (existingUserWatchList) {
            throw new ServerError("User already has a watchlist")
        }
        const newWatchList = await prisma.watchList.create({
            data: {
                userId
            }
        })
        return newWatchList;
      });
      return userWatchlist;
    } catch (error) {
        throw new ServerError("Failed to create new watchlist");
    }
  };

  createNewWatchHistory = async (userId: string) => {
    try {
      const userWatchHistory = await prisma.$transaction(async (prisma) => {
        const existingUserWatchHistory = prisma.watchHistory.findUnique({
          where: { userId },
        });
        if (existingUserWatchHistory) {
            throw new ServerError("User already has a watchlist")
        }
        const newWatchHistory = await prisma.watchHistory.create({
            data: {
                userId
            }
        })
        return newWatchHistory;
      });
      return userWatchHistory;
    } catch (error) {
        throw new ServerError("Failed to create new watchlist");
    }
  };

  getWatchListMovies = async (userId: string) => {
    try {
        const userWatchlistMovies = await prisma.$transaction(async (prisma) => {
            const existingUserWatchList = prisma.watchList.findUnique({
              where: { userId },
            });
            if (!existingUserWatchList) {
                throw new ServerError("User does not have a watchlist")
            }
            const watchListMovies = await prisma.watchList.findMany({
                where: { userId },
                include: {
                    movies: true
                }
            })
            return watchListMovies;
          });
          return userWatchlistMovies;
    } catch (error) {
        return null;
    }
  }

  getWatchHistoryMovies = async (userId: string) => {
    try {
        const userWatchHistoryMovies = await prisma.$transaction(async (prisma) => {
            const existingUserWatchHistory = prisma.watchHistory.findUnique({
              where: { userId },
            });
            if (!existingUserWatchHistory) {
                throw new ServerError("User does not have watch history")
            }
            const watchHistoryMovies = await prisma.watchHistory.findMany({
                where: { userId },
                include: {
                    movies: true
                }
            })
            return watchHistoryMovies;
          });
          return userWatchHistoryMovies;
    } catch (error) {
        
    }
  }

}
export default MovieListsRepository;
