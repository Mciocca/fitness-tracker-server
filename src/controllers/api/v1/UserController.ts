import { Response } from 'express';
import { serializeUser } from '../../../serializers/User';
import UserUpdater from '../../../services/UserUpdater';
export default class UserController {
  public static show(req: any, res: Response): void {
    const user = serializeUser(req.user);

    res.status(200);
    res.json({ user });
  }

  public static async update(req: any, res: Response) {
    const updater = new UserUpdater(req.body.user, req.user);
    if (await updater.update()) {
      res.status(200);
      res.json(serializeUser(updater.user));
    } else {
      res.status(updater.errorStatus);
      res.json(updater.errors);
    }
  }
}
