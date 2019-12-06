import { validateOrReject } from 'class-validator';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../entity/User';
import { serializeUser } from '../serializers/User';
import { arrayValidationErrors } from '../utils/validationErrorFormatter';

const createJWT = (user: User) => jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30 days'});
export default class AuthController {
  public static authenticate(req: any, res: Response): void {
    passport.authenticate('login', { session: false}, (err, user) => {
      if (!user) {
        res.status(401);
        return res.json({ errors: ['Could not login with given credentials'] });
      }
      res.cookie('jwt', createJWT(user), { httpOnly: true, sameSite: true });
      res.status(200);
      res.json({ user: serializeUser(user) });
    })(req, res);
  }

  public static new(req: Request, res: Response): void {
    res.render('authentication/new', {
      message: req.flash(),
    });
  }

  public static async create(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      res.json({ errors: ['Email already exists'] });
    } else {
      const user = User.create({ firstName, lastName, email });
      user.password = password;

      try {
        await validateOrReject(user);
      } catch (error) {
        res.status(400);
        return res.json({ errors: arrayValidationErrors(error) });
      }

      try {
        await user.save();
        res.cookie('jwt', createJWT(user), { httpOnly: true, sameSite: true });
        res.status(201);
        res.json({ user: serializeUser(user) });
      } catch (error) {
        res.json({errors: ['Something went wrong, please try again.']});
      }
    }
  }
}
