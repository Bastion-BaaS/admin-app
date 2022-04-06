const collectionController = require('../controllers/collectionController');
const axios = require('axios');

jest.mock('axios');

describe('Data actions', () => {
  let collections;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    collections = [
      {
        stackName: 'bastion-1',
        name: 'collection-1'
      },
      {
        stackName: 'bastion-1',
        name: 'collection-2',
      },
      {
        stackName: 'bastion-1',
        name: 'collection-3'
      }
    ]

    mockRequest = {
      params: { stackName: 'bastion-1' },
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
        return data
      },
      status: function(s) {
        this.statusCode = s;
        return this;
      }
    };
  });

  test('Retrieves all collections for given stackName', () => {
    const req = mockRequest;
    const res = mockResponse;

    axios.get.mockResolvedValue({
      data: collections,
    });

    collectionController.getCollections(req, res)
      .then(allData => {
        expect(allData.length).toEqual(3);
        expect(allData[0].stackName).toEqual('bastion-1');
        expect(allData[1].stackName).toEqual('bastion-1');
        expect(allData[2].stackName).toEqual('bastion-1');
      });
  });

  test('Retrieves a single collection by collection name', () => {
    const req = mockRequest;
    req.params.name = 'collection-2';
    const res = mockResponse;

    axios.get.mockResolvedValue({
      data: collections[1],
    });

    collectionController.getCollection(req, res)
      .then(collection => {
        expect(collection.stackName).toEqual('bastion-1');
        expect(collection.name).toEqual('collection-2');
      });
  });

  test('Creation of a collection', () => {
    const req = mockRequest;
    req.body = { name: 'newCollection' };
    const res = mockResponse;

    axios.post.mockResolvedValue({
      data: { name: 'newCollection' },
    });

    collectionController.createCollection(req, res)
      .then(newCollection => {
        expect(res.statusCode).toEqual(201);
        expect(newCollection.name).toEqual('newCollection');
      });
  });

  test('Deletion of a collection', () => {
    const req = mockRequest;
    req.params.name = 'collection-2';
    const res = mockResponse;

    axios.delete.mockResolvedValue({});

    collectionController.deleteCollection(req, res)
      .then(() => {
        expect(res.statusCode).toEqual(204);
      });
  });
});