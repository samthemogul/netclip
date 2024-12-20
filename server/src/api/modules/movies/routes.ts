import express from 'express'
import MovieController from './controllers'

const router = express.Router()
const movieController = new MovieController()



router.get('/top', movieController.getTopMovies)
router.get('/:imdbId', movieController.getMovie)
router.get('/search/:query', movieController.searchMovies)
router.get('/trailer/:videoId', movieController.getTrailer)
router.get('/video', movieController.getMovieVideo)
router.get('/recommendations/:userId', movieController.getRecommendations)


export default router