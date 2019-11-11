import { Request, Response } from 'express';

export default class HomeController {
  public static home(req: Request, res: Response): void {
      res.send('Hello!');
  }
}
