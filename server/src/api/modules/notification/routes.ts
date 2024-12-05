import express from 'express'
import NotificationsController from './controllers'

const router = express.Router()
const notificationController = new NotificationsController()

router.post('/movie/:imdbId/set-reminder', notificationController.setMovieReminder)


export default router