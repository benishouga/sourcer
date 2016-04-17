import { Request, Response } from 'express';

export function list(req: Request, res: Response) {
  "use strict";
}

export function show(req: Request, res: Response) {
  "use strict";
}

export function create(req: Request, res: Response) {
  "use strict";
  let againstId: string = req.params['id'];
  console.log('againstId', againstId);
  if (!againstId) {
    return res.status(400).send('');
  }
  let response = {
    _id: 'dummyIdXxx'
  };

  setTimeout(() => {
    res.status(201).send(response);
  }, 1000);
}
