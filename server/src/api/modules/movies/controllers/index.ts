import { Request, Response, NextFunction } from "express"
import MovieService from "../services"

const movieService = new MovieService()

class MovieController {
    async getTopMovies(req: Request, res: Response, next: NextFunction) {
        try {
            const { data, error } = await movieService.getTopMovies()
        } catch (error) {
            next(error)
        }
    }
}

export default MovieController