import { Router } from 'express';
import passport from '../config/passport';
import ConfigurationController from '../controllers/api/v1/ConfigurationController';
import UserController from '../controllers/api/v1/UserController';
import ExerciseController from '../controllers/api/v1/ExerciseController';
import WorkoutController from '../controllers/api/v1/WorkoutController';
const router = Router();

router.get('/api/v1', ConfigurationController.show);

router.use(passport.authenticate('jwt', { session: false }));
router.get('/api/v1/user', UserController.show);
router.patch('/api/v1/user', UserController.update);
router.get('/api/v1/exercise', ExerciseController.search);

router.get('/api/v1/workouts/:id', WorkoutController.show);
router.post('/api/v1/workouts', WorkoutController.create);

export default router;
