const mongoose = require('mongoose');
const RulePriority = require('../models/listenerRulesPriority');
const config = require('../utils/config');

const configureMongo = (user, password, host, port, dbName) => {
  if (config.NODE_ENV === 'production') {
    mongoose.set('debug', { color: false, shell: true });
  } else {
    mongoose.set('debug', { color: true, shell: true });
  }
  const connectionURL = `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin`;

  mongoose.connect(connectionURL)
    .then(() => console.log(`Connected to MongoDB: ${dbName}`))
    .catch(err => console.error(`Failed to connect to MongoDB: ${connectionURL} \n error: ${err}`));
};

const setRulePriority = async () => {
  let result;

  try {
    const rulePriority = await RulePriority.find({})
    if (rulePriority.length !== 0) {
      // if a rule priority exists, do nothing
      console.log(`Rule priority is checked. It was: ${rulePriority}`);
      result = 'connected';
    } else {
      await RulePriority.create({ Current: 1 })
      console.log('Rule priority is set');
      result = 'connected';
    }
  } catch(err) {
    result = err;
  }

  return result;
};

module.exports = { configureMongo, setRulePriority }
