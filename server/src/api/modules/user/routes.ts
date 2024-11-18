import express from 'express'
import UserController from './controllers'

const router = express.Router()
const userController = new UserController()


router.get('/:userId', userController.getUser)

export default router