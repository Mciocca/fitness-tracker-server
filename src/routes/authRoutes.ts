import { Router } from 'express';
import AuthController from '../controllers/authController';
const router = Router();

router.post('/login', AuthController.authenticate);
router.post('/registration', AuthController.create);

export default router;
