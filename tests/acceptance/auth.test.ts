/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import request from 'supertest';
import passport from '../../src/config/passport';
import User from '../../src/entity/User';
import { startServer } from '../../src/startServer';

const LOCATION_HEADER = 'location';
let server;
let agent;
let app;

describe('auth and user creation', () => {
  before(async () => {
    const { app: testApp, server: testServer } = await startServer();
    app = testApp;
    // TODO: could this cause a race condition?
    app.on('appStarted', () => {
      server = testServer;
      agent = request.agent(app);
    });
  });

  afterEach(() => {
    User.clear();
  });

  after(() => {
    server.close();
  });

  describe('creating a new user', () => {
    it('succesfully creates a new user', async () => {
      return agent.post('/registration')
        .send({
            email: 'cat@dog.com',
            firstName: 'cat',
            lastName:  'dog',
            password: 'catdog',
        })
        .expect(201)
        .then(async (res) => {
          const user = await User.findOne({email: 'cat@dog.com'});
          const [token] = res.headers['set-cookie'];
          expect(token).include('jwt=');
          expect(user.email).to.eq('cat@dog.com');
        });
    });

    it('does not alllow duplicate email address', async () => {
      const user = User.create({ email: 'cat@dog.com', firstName: 'cat', lastName: 'dog' });
      user.password = 'password';
      await user.save();

      return agent.post('/registration')
        .send({
            email: 'cat@dog.com',
            firstName: 'cat',
            lastName:  'dog',
            password: 'catdog',
        })
        .expect(400)
        .then(async (res) => {
          expect(await User.find({ email: user.email })).to.have.length(1);
        });
    });

    it('only allows valid emails', async () => {
      return agent.post('/registration')
        .send({
            email: 'cat',
            firstName: 'cat',
            lastName:  'dog',
            password: 'catdog',
        })
        .expect(400)
        .then(async (res) => {
          expect(await User.find({ email: 'cat' })).to.have.length(0);
        });
    });

    it('requires a password', async () => {
      return agent.post('/registration')
        .send({
            email: 'cat',
            firstName: 'cat',
            lastName:  'dog',
            password: '',
        })
        .expect(400)
        .then(async (res) => {
          expect(await User.find({ email: 'cat' })).to.have.length(0);
        });
    });

    it('requires a password to be 6 characters', async () => {
      return agent.post('/registration')
        .send({
          email: 'cat@dog.com',
          firstName: 'cat',
          lastName:  'dog',
          password: 'cat',
        })
        .expect(400)
        .then(async (res) => {
          expect(await User.find({ email: 'cat@dog.com' })).to.have.length(0);
        });
    });

    it('requires a firstname', async () => {
      return agent.post('/registration')
        .send({
          email: 'cat',
          firstName: '',
          lastName:  'dog',
          password: 'cat',
        })
        .expect(400)
        .then(async (res) => {
          expect(await User.find({ email: 'cat@dog.com' })).to.have.length(0);
        });
    });

    it('requires a lastname', async () => {
      return agent.post('/registration')
        .send({
            email: 'cat@dog.com',
            firstName: 'cat',
            lastName:  '',
            password: 'cat',
        })
        .expect(400)
        .then(async (res) => {
          expect(await User.find({ email: 'cat' })).to.have.length(0);
        });
    });
  });

  describe('logging in an existing user', () => {
    let user;
    before(async () => {
      user = User.create({ firstName: 'test', lastName: 'test', email: 'thisisan@email.com' });
      user.password = 'testpwd';
      await user.save();
    });

    it('sets the jwt cookie', async () => {
      return agent.post('/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .then(async (res) => {
          const [token] = res.headers['set-cookie'];
          expect(token).include('jwt=');
        });
    });

    it('does not set the jwt header when the wrong password is provided', async () => {
      return agent.post('/login')
        .send({
          email: user.email,
          password: 'haxxor',
        })
        .then(async (res) => {
          expect(res.headers['set-cookie']).to.not.be.ok;
        });
    });
  });

  describe('guarded routes', () => {
    const greeting = 'Hello World!';

    before(async () => {
      app.get('/protected-for-testing', passport.authenticate('jwt', {
        session: false,
      }), (req, res) => {
        res.send(greeting);
      });
    });

    it('returns 401 when visitor doesn\'t have a valid token', () => {
      return agent.get('/protected-for-testing')
      .expect(401);
    });

    it('allows someone with a valid jwt to view the page', async () => {
      const user = User.create({ firstName: 'test', lastName: 'test', email: 'thisisan@email.com' });
      user.password = 'testpwd';
      await user.save();

      return agent.post('/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .then(() => {
          return agent.get('/protected-for-testing')
            .expect(200)
            .then(res => {
              expect(res.text).to.include(greeting);
            });
        });
    });
  });
});
