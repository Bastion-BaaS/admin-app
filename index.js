const express = require('express');
const instanceRoutes = require('./routes/instanceRouter');
const dataRoutes = require('./routes/dataRouter');
const collectionRoutes = require('./routes/collectionRouter');
const cloudCodeRoutes = require('./routes/cloudCodeRouter');
const userRoutes = require('./routes/userRouter');
const fileRoutes = require('./routes/fileRouter');
const genericRoutes = require('./routes/genericRouter');
const { errorMiddleware } = require('./utils/middleware');
const config = require('./utils/config');
const app = express();
const db = require('./db');

app.use(express.json());

db.configureMongo(...config.MONGO_CREDENTIALS);
db.setRulePriority();

app.use('/admin/instances', instanceRoutes);
app.use('/admin/data', dataRoutes);
app.use('/admin/collections', collectionRoutes);
app.use('/admin/ccf', cloudCodeRoutes);
app.use('/admin/users', userRoutes);
app.use('/admin/files', fileRoutes);

if (config.NODE_ENV !== 'production') {
  app.use('/', genericRoutes);
}

app.use(errorMiddleware);

app.listen(config.PORT, () => console.log(`Server listening on port ${config.PORT}`));
