import { Request, Response, NextFunction } from "express"
import MovieService from "../services"

const movieService = new MovieService()

class MovieController {
    async getTopMovies(req: Request, res: Response, next: NextFunction) {
        try {
            const { data, error } = await movieService.getTopMovies()
            if (error) {
                throw error
            }
            if(!data) {
                throw new Error('No data found')
            }
            res.status(200).json({ success: true, movies: data})
        } catch (error) {
            next(error)
        }
    }
}

export default MovieController