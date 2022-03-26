const Instance = require('../models/instance');

const seedInstances = [
  {
    StackName: 'bastion-1',
    StackId: 'teststackid100',
    ApiKey: 'teststackapikey100'
  },
  {
    StackName: 'bastion-2',
    StackId: 'teststackid101',
    ApiKey: 'teststackapikey101'
  },
  {
    StackName: 'bastion-3',
    StackId: 'teststackid102',
    ApiKey: 'teststackapikey102'
  },
  {
    StackName: 'development',
    StackId: 'teststackid105',
    ApiKey: 'teststackapikey105'
  }
];

const generate = async () => {
  await Instance.deleteMany({});
  await Instance.insertMany(seedInstances);
};

module.exports = { generate };
