const express = require('express');
const formData = require('express-form-data');
const os = require('os');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const instanceRoutes = require('./routes/instanceRouter');
const dataRoutes = require('./routes/dataRouter');
const collectionRoutes = require('./routes/collectionRouter');
const cloudCodeRoutes = require('./routes/cloudCodeRouter');
const userRoutes = require('./routes/userRouter');
const fileRoutes = require('./routes/fileRouter');
const adminRouter = require('./routes/adminRouter');
const { errorMiddleware } = require('./utils/middleware');
const config = require('./utils/config');
const adminAuth = require('./utils/adminAuth');
const app = express();
const path = require('path');
const db = require('./db');
const seed = require('./db/seed');

app.use(express.json());
app.use(express.static('build'))
app.use(formData.parse({uploadDir: os.tmpdir(), autoClean: true}));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

app.use(session(adminAuth.sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(adminAuth.validate));
passport.serializeUser(adminAuth.serialize);
passport.deserializeUser(adminAuth.deserialize);

if (config.NODE_ENV === 'development') {
  db.configureMongo(...config.MONGO_CREDENTIALS);
  db.setRulePriority();
  seed.generate();
} else {
  setTimeout(() => {
    db.configureMongo(...config.MONGO_CREDENTIALS);
    db.setRulePriority();
  }, 30000);
}

app.use('/admin/instances', adminAuth.checkAuthenticated, instanceRoutes);
app.use('/admin/data', adminAuth.checkAuthenticated, dataRoutes);
app.use('/admin/collections', adminAuth.checkAuthenticated, collectionRoutes);
app.use('/admin/ccf', adminAuth.checkAuthenticated, cloudCodeRoutes);
app.use('/admin/users', adminAuth.checkAuthenticated, userRoutes);
app.use('/admin/files', adminAuth.checkAuthenticated, fileRoutes);
app.use('/admin', adminRouter);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, './build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.use(errorMiddleware);

app.listen(config.PORT, () => console.log(`Server listening on port ${config.PORT}`));
