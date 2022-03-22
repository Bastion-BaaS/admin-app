const express = require('express');
const mongoose = require('mongoose');

const instanceRoutes = require('./routes/instanceRouter');
const dataRoutes = require('./routes/dataRouter');
const collectionRoutes = require('./routes/collectionRouter');
const cloudCodeRoutes = require('./routes/cloudCodeRouter');
const userRoutes = require('./routes/userRouter');
const fileRoutes = require('./routes/fileRouter');

const RulePriority = require('./models/listenerRulesPriority');
const HttpError = require('./models/httpError');
const PORT = process.env.NODE_ENV === 'local' ? 3002 : 3001;

const test = (req, res, next) => {
  res.json({ test: 'hi' });
}

const env = (req, res, next) => {
  const envVars = {
    VpcId: process.env.VpcId,
    DBTierSubnet: process.env.DBTierSubnet,
    AppTierSubnet: process.env.AppTierSubnet,
    EFSSecurityGroup: process.env.EFSSecurityGroup,
    SGAppServer: process.env.SGAppServer,
    SGDBServer: process.env.SGDBServer,
    AppServerIAMRole: process.env.AppServerIAMRole,
    DBServerIAMRole: process.env.DBServerIAMRole,
    AppServerIAMRoleArn: process.env.AppServerIAMRoleArn,
    DBServerIAMRoleArn: process.env.DBServerIAMRoleArn,
    ALBListener: process.env.ALBListener,
    AppServerLG: process.env.AppServerLG,
  };
  res.json(envVars);
}

const db = (req, res, next) => {
  let url = 'mongodb://localhost:27017';
  if (process.env.NODE_ENV === 'local') {
    url = 'mongodb://localhost:27016';
  }

  mongoose.connect(url)
    .then(() => {
      RulePriority.find({})
        .then(rulePriority => {
          if (rulePriority.length !== 0) {
            // if a rule priority exists, do nothing
            console.log('connected to mongo');
            res.json({ status: 'connected' })
          } else {
            // if no rule priority exists, make one with value of 2
            RulePriority.create({ Current: 2 })
              .then(() => {
                console.log('connected to mongo');
                res.json({ status: 'connected' });
              })
              .catch(err => next(new HttpError(err, 500)));
          }
        })
        .catch(err => next(new HttpError(err, 500)));
    })
    .catch(err => next(new HttpError(err, 500)));
};

const app = express();
app.use(express.json());

app.get('/', test);
app.get('/admin/', test);
app.get('/admin/env', env);
app.get('/admin/db', db);

app.use('/admin/instances', instanceRoutes);
app.use('/admin/data', dataRoutes);
app.use('/admin/collections', collectionRoutes);
app.use('/admin/ccf', cloudCodeRoutes);
app.use('/admin/users', userRoutes);
app.use('/admin/files', fileRoutes);

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.code || 500).json({ error: err.message || "An unknown error occured" });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
