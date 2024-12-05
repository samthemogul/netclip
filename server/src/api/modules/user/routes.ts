import express from 'express'
import UserController from './controllers'

const router = express.Router()
const userController = new UserController()


router.get('/:userId', userController.getUser)
router.get('/:userId/streak', userController.getStreak)
router.put('/:userId/update-watch-date', userController.updateLastWatch)

export default router