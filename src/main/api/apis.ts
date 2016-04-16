import { Express } from 'express';
import * as UserApi from './UserApi';
import * as MatchApi from './MatchApi';
import * as SessionApi from './SessionApi';

export default (app: Express) => {
  app.get('/api/user/recent', UserApi.recent);
  app.get('/api/user', UserApi.show);
  app.post('/api/user', UserApi.create);
  app.get('/api/user/:id', UserApi.show);
  app.put('/api/user', UserApi.update);

  app.get('/api/match', MatchApi.list);
  app.get('/api/match/:id', MatchApi.show);
  app.post('/api/match/against/:id', MatchApi.create);

  app.post('/api/session', SessionApi.create);
  app.get('/api/session', SessionApi.show);
  app.delete('/api/session', SessionApi.destroy);
}
