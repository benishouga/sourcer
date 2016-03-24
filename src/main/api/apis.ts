import { Express } from 'express';
import * as UserApi from './UserApi';
import * as AiApi from './AiApi';
import * as MatchApi from './MatchApi';
import * as SessionApi from './SessionApi';

export default (app: Express) => {
  app.get('/api/user', UserApi.show);
  app.post('/api/user', UserApi.create);
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

  app.post('/api/session', SessionApi.create);
  app.get('/api/session', SessionApi.show);
  app.delete('/api/session', SessionApi.destroy);
}
