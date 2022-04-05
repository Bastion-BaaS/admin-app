const passport = require('passport');

const login = (req, res, next) => {
  // Login admin
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json(403, { message: 'Unable to authenticate' });
    }

    req.login(user, err => {
      if (err) {
        return next(err);
      }

      return res.json({ message: 'Admin user authenticated' });
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  // Logout admin
  const user = req.user;
  req.logout();
  res.status(200).json({ message: `Admin user with username: ${user.username} has logged out`});
};

const check = (req, res, next) => {
  const user = req.user;
  return res.json({ message: `${user.username} logged in` });
};

module.exports = {
  login,
  logout,
  check
}