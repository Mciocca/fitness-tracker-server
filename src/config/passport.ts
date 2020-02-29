import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import User from '../entity/User';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const JWT_COOKIE = 'jwt';
const JWT_SECRET = process.env.JWT_SECRET;

// setting jwt happens in AuthController#authenticate since we don't have access to response here
passport.use('login',
  new LocalStrategy({
    passwordField: 'password',
    usernameField: 'email',
  }, async (email: string, password: string, done) => {
    const user = await User.findOne({ email });
    if (!user) {
     return done(null, false, { message: 'Failed to login' });
    }

    if (await user.validLogin(password)) {
      done(null, user, { message: 'Logged in'});
    } else {
      done(null, false, { message: 'Failed to login' });
    }
  }),
);

passport.use(new JWTStrategy(
  {
    jwtFromRequest: (req): string => {
      let token: string;
      if (req) {
        token = req.cookies[JWT_COOKIE];
      }
      return token;
    },
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    let user: User;
    try {
      user = await User.findOne({ id: jwtPayload.userId}, { relations: ['profile']});
    } catch (e) {
      done('You must login to view this page');
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false, { message: 'You must login to view this page.'} );
    }
  }),
);

export default passport;
