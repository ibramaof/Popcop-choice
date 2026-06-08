import { Router } from 'express'

const router = Router()

router.post('/recommend', (req, res) => {
    res.json({ message: 'recommend route is working' })
})

export default router