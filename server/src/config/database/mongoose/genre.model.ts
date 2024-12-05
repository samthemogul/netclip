import mongoose, { Schema, Document, Model } from "mongoose";
import { IMovie } from "./movie.model";

interface IGenre extends Document {
    genreName: string;
    movies: IMovie[];
  }
  

  const GenreSchema: Schema<IGenre> = new Schema<IGenre>(
    {
      genreName: { type: String, required: true, unique: true },
      movies: { type: [Object], required: true },
    },
    { timestamps: true }
  );
  
