import { Request, Response, NextFunction } from "express";
import MovieService from "../services";

const movieService = new MovieService();

class MovieController {
  async getTopMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await movieService.getTopMovies();
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("No data found");
      }
      res.status(200).json({ success: true, movies: data });
    } catch (error) {
      next(error);
    }
  }
  async getMovie(req: Request, res: Response, next: NextFunction) {
    try {
      const { imdbId } = req.params;
      const { data, error } = await movieService.getMovie(imdbId);
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("No data found");
      }
      res.status(200).json({ success: true, movie: data });
    } catch (error) {
      next(error);
    }
  }

  async searchMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.params;
      const { data, error } = await movieService.searchMovies(query);
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("No data found");
      }
      res.status(200).json({ success: true, results: data });
    } catch (error) {
      next(error);
    }
  }

  async getTrailer(req: Request, res: Response, next: NextFunction) {
    try {
      const { videoId } = req.params;
      const { data, error } = await movieService.getTrailer(videoId);
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("Trailer not found");
      }
    } catch (error) {
      next(error);
    }
  }
  async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { data, error } =
        await movieService.getMovieRecommendations(userId);
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("No data found");
      }
      res.status(200).json({ success: true, recommendations: data });
    } catch (error) {
      next(error);
    }
  }
  async getMovieVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { imdbId, userId, videoId } = req.body;
      const { data, error } = await movieService.getMovieVideo(
        userId,
        imdbId,
        videoId
      );
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("No data found");
      }
      res.status(200).json({ success: true, video: data });
    } catch (error) {
      next(error);
    }
  }
}

export default MovieController;
