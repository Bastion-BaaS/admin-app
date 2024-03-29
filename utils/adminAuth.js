const MongoStore = require('connect-mongo');
const config = require('./config');

const sessionConfig = (() => {
  const [ user, password, host, port ] = config.MONGO_CREDENTIALS;
  const connectionURL = `mongodb://${user}:${password}@${host}:${port}/sessionData?authSource=admin`

  return { 
    name: 'admin-cookie',
    secret: 'bastion is great',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict',       // only sends for same-site requests
    },
    store: MongoStore.create({
      mongoUrl: connectionURL
    })
  };
})();

const validate = async (name, password, done) => {
  const username = config.ADMIN_CREDENTIALS.AdminUsername;
  const adminPassword = config.ADMIN_CREDENTIALS.AdminPassword;
  if (name !== username) { 
    return done(null, false, { message: 'No user found' }); 
  }

  if (password !== adminPassword) {
    return done(null, false, { message: 'Incorrect password' });
  }

  return done(null, { username });
};

const serialize = (user, done) => {
  return done(null, user.username);
};

const deserialize = async (username, done) => {
  const user = config.ADMIN_CREDENTIALS.AdminUsername;
  return done(null, { username: user });
};

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() || config.NODE_ENV !== 'production') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized user' });
  }
};

module.exports = {
  sessionConfig,
  validate,
  serialize,
  deserialize,
  checkAuthenticated
}
