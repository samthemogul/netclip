interface IUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    photoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  }

export { IUser }