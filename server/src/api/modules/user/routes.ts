import express from 'express'

const router = express.Router()

router.get('/:userId', (req, res) => {
    res.json({ user: "sam" })
})

export default router