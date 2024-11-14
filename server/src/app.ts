import express from 'express'
import dotenv from 'dotenv'
import AppController from './api/initiators/appController'


// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config()

// Start Application Servers
export const app = express()

const PORT = process.env.PORT as string
const appController = new AppController(app, PORT)
appController.startApp()
