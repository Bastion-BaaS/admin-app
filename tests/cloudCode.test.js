const cloudCodeController = require('../controllers/cloudCodeController');
const axios = require('axios');

jest.mock('axios');

describe('CCF actions', () => {
  let ccfs;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    ccfs = [
      {
        id: '1',
        functionName: 'testFile1'
      },
      {
        id: '2',
        functionName: 'testFile2'
      },
      {
        id: '3',
        functionName: 'testFile3'
      }
    ];

    mockRequest = {
      params: { stackName: 'bastion' },
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

  test('Retrieves all ccfs for given stackName', () => {
    const req = mockRequest;
    const res = mockResponse;

    axios.get.mockResolvedValue({
      data: ccfs,
    });

    cloudCodeController.getCloudCodeFunctions(req, res)
      .then(ccfs => {
        expect(ccfs.length).toEqual(3);
        expect(ccfs[0].functionName).toEqual('testFile1');
        expect(ccfs[1].functionName).toEqual('testFile2');
        expect(ccfs[2].functionName).toEqual('testFile3');
      });
  });
});
