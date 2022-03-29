const express = require('express');
const formData = require('express-form-data');
const os = require('os');
const instanceRoutes = require('./routes/instanceRouter');
const dataRoutes = require('./routes/dataRouter');
const collectionRoutes = require('./routes/collectionRouter');
const cloudCodeRoutes = require('./routes/cloudCodeRouter');
const userRoutes = require('./routes/userRouter');
const fileRoutes = require('./routes/fileRouter');
const { errorMiddleware } = require('./utils/middleware');
const config = require('./utils/config');
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

app.use('/admin/instances', instanceRoutes);
app.use('/admin/data', dataRoutes);
app.use('/admin/collections', collectionRoutes);
app.use('/admin/ccf', cloudCodeRoutes);
app.use('/admin/users', userRoutes);
app.use('/admin/files', fileRoutes);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, './build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});

app.use(errorMiddleware);

app.listen(config.PORT, () => console.log(`Server listening on port ${config.PORT}`));
