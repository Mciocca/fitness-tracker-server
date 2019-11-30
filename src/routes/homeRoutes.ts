import { Router } from 'express';
import passport from '../config/passport';
import HomeController from '../controllers/homeController';
const router = Router();

router.get('/', passport.authenticate('jwt', {
  failureFlash: true,
  failureRedirect: '/login',
  session: false,
}), HomeController.home);

export default router;
