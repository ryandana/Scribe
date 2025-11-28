import { Router } from 'express'
import { check, login, logout, register } from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', authMiddleware, logout)
router.get('/me', authMiddleware, check)

export default router