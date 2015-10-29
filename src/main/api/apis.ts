import { Express } from 'express';
import * as UserApi from './UserApi';
import * as AiApi from './AiApi';
import * as MatchApi from './MatchApi';

export default (app: Express) => {
  app.get('/api/user', UserApi.show);
  app.get('/api/user/:id', UserApi.show);
  app.post('/api/user/:id', UserApi.update);

  app.get('/api/ai', AiApi.list);
  app.get('/api/ai/:owner/:ai', AiApi.show);
  app.post('/api/ai', AiApi.create);
  app.post('/api/ai/:owner/:ai', AiApi.update);
  app.delete('/api/ai/:owner/:ai', AiApi.destroy);

  app.get('/api/match', MatchApi.list);
  app.get('/api/match/:id', MatchApi.show);
  app.post('/api/match', MatchApi.create);
}