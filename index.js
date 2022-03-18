const express = require('express');
const mongoose = require('mongoose');

const instanceRoutes = require('./routes/instanceRouter');
const dbRoutes = require('./routes/dbRouter');

const PORT = 3001;

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

const Cat = mongoose.model('Cat', { name: String });

const db = (req, res, next) => {
  mongoose.connect('mongodb://localhost:27017')
    .then(result => {
      console.log('connected to mongo');
      res.json({ status: 'connected' });
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
}

const addCat = (req, res, next) => {
  const kitty = new Cat({ name: 'Pavlo' });
  console.log('in test route');
  kitty.save()
    .then(response => {
      console.log(response);
      res.send(response);
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
}

const findCats = (req, res, next) => {
  Cat.find({})
    .then(response => {
      console.log(response);
      res.json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(418).send();
    });
}

const app = express();
app.use(express.json());

app.get('/', test);
app.get('/admin/', test);
app.get('/env', env);
app.get('/admin/env', env);
app.get('/db', db);
app.get('/admin/db', db);
app.get('/admin/addCat', addCat);
app.get('/admin/findCats', findCats);

app.use('/admin/instances', instanceRoutes);
app.use('/admin/db', dbRoutes);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
