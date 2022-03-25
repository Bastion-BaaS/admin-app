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
    StackName: 'bastion-4',
    StackId: 'teststackid103',
    ApiKey: 'teststackapikey103'
  },
  {
    StackName: 'bastion-5',
    StackId: 'teststackid104',
    ApiKey: 'teststackapikey104'
  }
];

const generate = async () => {
  await Instance.deleteMany({});
  await Instance.insertMany(seedInstances);
};

module.exports = { generate };
