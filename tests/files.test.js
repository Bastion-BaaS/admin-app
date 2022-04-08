const fileController = require('../controllers/fileController');
const axios = require('axios');

jest.mock('axios');

describe('File actions', () => {
  const files = [
    {
      id: '1',
      fileName: 'testFile1',
      url: 'exampleurl.com'
    },
    {
      id: '2',
      fileName: 'testFile2',
      url: 'testurl.com'
    },
    {
      id: '3',
      fileName: 'testFile3',
      url: 'anotherurl.com'
    }
  ];

  let mockRequest;
  let mockResponse;

  beforeEach(() => {
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
      }
    };
  });

  test('Retrieves all files for given stackName', () => {
    const req = mockRequest;
    const res = mockResponse;

    axios.get.mockResolvedValue({
      data: files,
    });

    fileController.getFiles(req, res)
      .then(files => {
        expect(files.length).toEqual(3);
        expect(files[0].fileName).toEqual('testFile1');
        expect(files[1].fileName).toEqual('testFile2');
        expect(files[2].fileName).toEqual('testFile3');
      });
  });

  test('Retrieves a single file by ID', () => {
    const req = mockRequest;
    req.params.id = '3';
    const res = mockResponse;

    axios.get.mockResolvedValue({
      data: files[2],
    });

    fileController.getFile(req, res)
      .then(file => {
        expect(file).toEqual(files[2]);
        expect(file.id).toEqual('3');
        expect(file.fileName).toEqual('testFile3');
      });
  });
});
