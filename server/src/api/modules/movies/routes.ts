import express from 'express'

const router = express.Router()


router.get('/latest', (req, res) => {
    res.json("Movies")
})

export default router