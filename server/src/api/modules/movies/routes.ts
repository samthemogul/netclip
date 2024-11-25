import express from 'express'
import MovieController from './controllers'

const router = express.Router()
const movieController = new MovieController()



router.get('/top', movieController.getTopMovies)

export default router