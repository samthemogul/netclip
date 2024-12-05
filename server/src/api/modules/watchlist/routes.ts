import express from 'express'
import MovieListController from './controllers'

const router = express.Router()
const movieListController = new MovieListController()




router.post('/new/"userId', movieListController.addMovieToWatchList)
router.get('/:userId', movieListController.getWatchList)
router.delete('/:userId/movies/:movieId', movieListController.deleteFromWatchlist)
router.post('/:userId/movies/:movieId/set-reminder')

export default router