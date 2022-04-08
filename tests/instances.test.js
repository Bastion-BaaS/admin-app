const instanceController = require('../controllers/instanceController');
const Instance = require('../models/instance');
const mockingoose = require('mockingoose');

describe('Instance actions', () => {
  let instances;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    instances = [
      {
        StackName: 'bastion-1',
        StackId: 'teststackid1',
        ApiKey: 'teststackapikey',
        FileBucketName: 'testfilebucket1',
        CCFBucketName: 'testccfbucket1'
      },
      {
        StackName: 'bastion-2',
        StackId: 'teststackid2',
        ApiKey: 'teststackapikey',
        FileBucketName: 'testfilebucket2',
        CCFBucketName: 'testccfbucket2'
      },
      {
        StackName: 'bastion-3',
        StackId: 'teststackid3',
        ApiKey: 'teststackapikey',
        FileBucketName: 'testfilebucket3',
        CCFBucketName: 'testccfbucket3'
      }
    ];

    mockRequest = {
      params: {},
      body: {},
      axiosConfig: {
        headers: {
          'Authorization': 'Basic development',
          'X-REQUESTED-BY': 'admin-app',
          'Content-Type': 'application/json'
        }
      }
    };
  
    mockResponse = {
      json: function(data) {
        return data;
      },
      status: function(s) {
        this.statusCode = s;
        return this;
      }
    };
  });

  test('Retrieves all instances', () => {
    const req = mockRequest;
    const res = mockResponse;

    mockingoose(Instance).toReturn(instances);

    instanceController.getBaaSInstances(req, res)
      .then(allInstances => {
        expect(JSON.parse(JSON.stringify(allInstances))).toMatchObject(instances);
      });
  });

  test('Retrieves a single instance by stackName', () => {
    const req = mockRequest;
    req.params.stackName = 'bastion-1';
    const res = mockResponse;

    mockingoose(Instance).toReturn(instances[0], 'findOne');

    instanceController.getBaaSInstance(req, res)
      .then(instance => {
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(JSON.stringify(instance))).toMatchObject(instances[0]);
      });
  });
});