import { Request, Response } from 'express';
import { links } from '../../../serializers/Configuration';

export default class ConfigurationController {
  public static show(request: Request, res: Response): void {
    res.cookie('XSRF-TOKEN', request.csrfToken());
    res.json({ links });
  }
}
