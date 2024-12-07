import express from 'express'
import MovieListController from './controllers'

const router = express.Router()
const movieListController = new MovieListController()



router.post('/new/:userId', movieListController.addMovieToHistory)
router.get('/:userId', movieListController.getHistory)

export default router