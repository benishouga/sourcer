import { Request, Response } from 'express';

import ResponseCreator from './ResponseCreator';

export function show(_req: Request, res: Response) {
  return res.send(ResponseCreator.config()).end();
}
