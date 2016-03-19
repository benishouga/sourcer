import { Request, Response } from 'express';

export function show(req: Request, res: Response, next: Function) {
  "use strict";
  var userId: string = req.param('userId');
  console.log('userId', userId);
}

export function create(req: Request, res: Response, next: Function) {
  "use strict";
}

export function update(req: Request, res: Response, next: Function) {
  "use strict";
  var userId: string = req.param('userId');
  console.log('userId', userId);
}
