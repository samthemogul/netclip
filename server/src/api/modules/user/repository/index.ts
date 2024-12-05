import prisma from "../../../../config/database/prisma";
import { AuthError } from "../../../../libs/handlers/error";
import { IUser } from "../../../../types";

class UserRepository {
  private model = prisma.user;
  private preferencesModel = prisma.userPreferences;
  private movieModel = prisma.movie;
  private genreModel = prisma.genre;

  createOne = async ({
    email,
    firstname,
    lastname,
    photoUrl,
  }: {
    email: string;
    firstname: string;
    lastname: string;
    photoUrl?: string;
  }): Promise<IUser | null> => {
    try {
      const newUser = await prisma.$transaction(
        async (prisma) => {
          const foundUser = await prisma.user.findUnique({ where: { email } });
          if (foundUser)
            throw new AuthError(`User with email ${email} already exists`);

          return prisma.user.create({
            data: {
              email,
              firstname,
              lastname,
              photoUrl,
            },
          });
        },
        { timeout: 30000 }
      );
      return newUser;
    } catch (error) {
      if (error.code === "P2002") {
        return null;
      }
      return null;
    }
  };

  findOne = async (q: any) => {
    try {
      const foundUser = await this.model.findUnique({ where: q });
      return foundUser;
    } catch (error) {
      return null;
    }
  };

  findById = async (id: string) => {
    try {
      const foundUser = await this.model.findUnique({ where: { id } });
      return foundUser;
    } catch (error) {
      return null;
    }
  };

  updateField = async (
    id: string,
    field: string,
    value: string | number | boolean
  ) => {
    try {
      const updatedUser = await this.model.update({
        where: { id: id },
        data: { [field]: value },
      });
      return updatedUser;
    } catch (error) {
      return null;
    }
  };
  updateLastWatch = async (userId: string) => {
    try {
      const updatedUser = await this.model.update({
        where: { id: userId },
        data: { lastWatch: new Date() },
      });
      return updatedUser;
    } catch (error) {
      return null;
    }
  };

  updateStreak = async (userId: string, streak: number) => {
    try {
      const updatedUser = await this.model.update({
        where: { id: userId },
        data: { streakCount: streak },
      });
      return updatedUser;
    } catch (error) {
      return null;
    }
  };
  updateActorsPreferences = async (userId: string, actors: string[]) => {
    try {
      const existingFavouriteActors =
        (await this.preferencesModel.findUnique({ where: { userId } }))
          ?.favoriteActors || [];
      const updatedFavouriteActors = [...existingFavouriteActors, ...actors];
      await this.preferencesModel.update({
        where: { userId },
        data: {
          favoriteActors: {
            set: updatedFavouriteActors,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };
  updateMoviesPreferences = async (userId: string, movie: string) => {
    try {
      await this.preferencesModel.update({
        where: { userId },
        data: {
          watchedMovies: {
            push: movie,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };
  updateGenresPreferences = async (userId: string, genreName: string) => {
    try {
      await this.preferencesModel.update({
        where: { userId },
        data: {
          genres: {
            connectOrCreate: {
              where: { name: genreName },
              create: {
                name: genreName,
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };
  getUserPreferences(userId: string) {
    try {
      return this.preferencesModel.findUnique({
        where: { userId },
        include: { genres: true },
      });
    } catch (error) {
      throw error;
    }
  }
  getSimilarUsers = async (
    userId: string,
    limit: number = 5
  ): Promise<IUser[] | null> => {
    try {
      // Fetch the user's preferences
      const userPreferences = await this.preferencesModel.findUnique({
        where: { userId },
        include: { genres: true },
      });

      if (!userPreferences) {
        throw new Error(`Preferences not found for user with ID: ${userId}`);
      }

      const { favoriteActors, genres, watchedMovies } = userPreferences;

      const similarUsers = await this.model.findMany({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                {
                  userPreferences: {
                    favoriteActors: {
                      hasSome: favoriteActors || [],
                    },
                  },
                },
                {
                  userPreferences: {
                    genres: {
                      some: {
                        id: { in: genres.map((genre) => genre.id) },
                      },
                    },
                  },
                },
                {
                  userPreferences: {
                    watchedMovies: {
                      hasSome: watchedMovies || [],
                    },
                  },
                },
              ],
            },
          ],
        },
        take: limit,
      });

      return similarUsers;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}

export default UserRepository;
