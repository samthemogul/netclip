import { NextFunction, Request, Response } from "express";
import MovieListService from "../services";
import { ServerError } from "../../../../libs/handlers/error";

const movieListService = new MovieListService();

class MovieListController {
  async addMovieToWatchList(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { title, description, image, year, imdbId, genres, rating } =
        req.body;
      const { data, error } = await movieListService.addMovieToWatchList(
        userId,
        title,
        description,
        image,
        year,
        imdbId,
        genres,
        rating
      );
      if (error) {
        next(error);
      }
      if (!data) {
        throw new ServerError("Movie or watchlist not found");
      }
      res.status(201).json({ success: true, watchlist: data });
    } catch (error) {
      next(error);
    }
  }
  async addMovieToHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { title, description, image, year, imdbId, genres, rating } =
        req.body;
      const { data, error } = await movieListService.addMovieToHistory(
        userId,
        title,
        description,
        image,
        year,
        imdbId,
        genres,
        rating
      );
      if (error) {
        next(error);
      }
      if (!data) {
        throw new ServerError("Movie or history not found");
      }
      res.status(201).json({ success: true, history: data });
    } catch (error) {
      next(error);
    }
  }
  async getWatchList(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { data, error } = await movieListService.getWatchList(userId);
      if (error) {
        next(error);
      }
      if (!data) {
        throw new ServerError("Watchlist not found");
      }
      res.status(200).json({ success: true, watchlist: data });
    } catch (error) {
      next(error);
    }
  }
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { data, error } = await movieListService.getHistory(userId);
      if (error) {
        next(error);
      }
      if (!data) {
        throw new ServerError("History not found");
      }
      res.status(200).json({ success: true, history: data });
    } catch (error) {
      next(error);
    }
  }
  async deleteFromWatchlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, imdbId } = req.params;
      const { data, error } = await movieListService.removeMovieFromWatchList(
        userId,
        imdbId
      );
      if (error) {
        next(error);
      }
      if (!data) {
        throw new ServerError("Movie not found in watchlist");
      }
      res.status(200).json({ success: true, watchlist: data });
    } catch (error) {
        next(error);
    }
  }
}

export default MovieListController;
