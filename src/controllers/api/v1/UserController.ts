import { Response } from 'express';
import { serializeUser } from '../../../serializers/User';

// TODO: figure out why passport req.user isn't on the req types.
export default class UserController {
  public static show(req: any, res: Response): void {
    const user = serializeUser(req.user);

    res.status(200);
    res.json({ user });
  }
}
