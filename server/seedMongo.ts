import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import csvParser from "csv-parser";
import mongoose from "mongoose";
import { getMovieModel } from "./src/config/database/mongoose/movie.model"; // Import the Genre model factory

dotenv.config();
// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const processCSV = async (filePath: string, genreName: string) => {
  const movies: any[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        movies.push({
          movie_id: row["movie_id"],
          movie_name: row["movie_name"],
          year: parseInt(row["year"]) || 2000,
          certificate: row["certificate"],
          run_time: row["run_time"],
          genre: row["genre"].split(","),
          rating: parseFloat(row["rating"]) || 0,
          description: row["description"],
          director: row["director"],
          director_id: row["director_id"],
          star: row["star"],
          star_id: row["star_id"],
          votes: parseInt(row["votes"]) || 0,
          gross: row["gross"],
        });
      })
      .on("end", async () => {
        console.log(`Finished processing ${genreName}...`);

        const MovieModel = getMovieModel(genreName);

        await MovieModel.insertMany(movies);

        resolve();
      })
      .on("error", (error) => reject(error));
  });
};

// Process all CSV files
const processAllCSVs = async () => {
  try {
    await connectDB();

    const csvDirectory = path.join(__dirname, "archive");
    const files = fs.readdirSync(csvDirectory);

    for (const file of files) {
      const genreName = path.basename(file, path.extname(file));
      const filePath = path.join(csvDirectory, file);

      await processCSV(filePath, genreName);
    }

    console.log("All CSV files processed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error processing CSV files:", error);
    process.exit(1);
  }
};

processAllCSVs();
