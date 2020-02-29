import request from 'supertest';
import {startServer } from '../../src/startServer';
import User from '../../src/entity/User';
import jwt from 'jsonwebtoken';

let server;
let agent;
let app;
let user;
let token;
let db;

describe('Requests to user controller', () => {
  before(async () => {
    const { app: testApp, server: testServer, dbConnection } = await startServer();
    app = testApp;
    db = dbConnection;

    app.on('appStarted', () => {
      server = testServer;
      agent = request.agent(app);
    });
  });

  // separated from before hook because mocha was timing out when this was there
  beforeEach(async () => {
    user = User.create({ email: 'cat@dog.com', firstName: 'cat', lastName: 'dog'});
    user.password = 'password';
    user = await user.save();
    token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30 days'});
  });

  afterEach(async () => {
    await user.remove();
  });

  after(() => {
    return new Promise(async (resolve, reject) => {
      // this prevents an issue where the next test starts before db is closed from previous test, causing new tests to fail and not run.
      await db.close();
      server.close(() => {
        return resolve();
      });
    });
  });

  it('returns the currently logged in user', () => {
    return agent.get('/api/v1/user')
      .set('Cookie', `jwt=${token};`)
      .expect(200, {
        user: {
          email: user.email,
          id: user.id,
          name: user.fullName,
          profile: null,
          updateUrl: '/api/v1/user',
        }
      });
  });
});
