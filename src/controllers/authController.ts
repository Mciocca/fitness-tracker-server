import { validateOrReject } from 'class-validator';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entity/User';
import { htmlValidationErrors } from '../utils/validationErrorFormatter';

export default class AuthController {
  public static login(req: Request, res: Response): void {
    res.render('authentication/login', {
      message: req.flash(),
    });
  }

  public static authenticate(req: any, res: Response): void {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '30 days'});
    res.cookie('jwt', token, { httpOnly: true, sameSite: true });
    res.redirect('/');
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
      req.flash('error', 'Email already exists');
      res.redirect('/registration');
    } else {
      const user = User.create({ firstName, lastName, email });
      user.password = password;

      try {
        await validateOrReject(user);
      } catch (error) {
        const messages: string = htmlValidationErrors(error);
        req.flash('error', messages);
        return res.redirect('/registration');
      }

      try {
        await user.save();
        req.flash('success', 'Account created, please sign in.');
        res.redirect('/login');
      } catch (e) {
        req.flash('error', e);
        res.redirect('/registration');
      }
    }
  }
}
