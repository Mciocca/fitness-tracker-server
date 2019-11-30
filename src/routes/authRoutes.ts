import { Router } from 'express';
import passport from '../config/passport';
import AuthController from '../controllers/authController';
const router = Router();

router.route('/login')
      .get(AuthController.login)
      .post(passport.authenticate('login', {
        failureFlash: true,
        failureRedirect: '/login',
        session: false,
      }), AuthController.authenticate);

router.route('/registration')
      .get(AuthController.new)
      .post(AuthController.create);

export default router;
