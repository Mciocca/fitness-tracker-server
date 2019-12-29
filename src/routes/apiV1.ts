import csurf from 'csurf';
import { Router } from 'express';
import passport from '../config/passport';
import ConfigurationController from '../controllers/api/v1/ConfigurationController';
import UserController from '../controllers/api/v1/UserController';
const router = Router();

router.use(csurf({ cookie: true }));
router.get('/api/v1', ConfigurationController.show);

router.use(passport.authenticate('jwt', { session: false }));
router.get('/api/v1/user', UserController.show);

export default router;
