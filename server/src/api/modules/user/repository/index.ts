import prisma from "../../../../config/database/prisma";
import { AuthError } from "../../../../libs/handlers/error";
import { IUser } from "../../../../types";

class UserRepository {
  private model = prisma.user;

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
}

export default UserRepository;
