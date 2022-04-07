const userController = require('../controllers/userController');
const axios = require('axios');

jest.mock('axios');

describe('User actions', () => {
  let users;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    users = [
      {
        id: '1',
        name: 'TestUser1',
        email: 'test@test.com',
        password: 'hashedPassword',
        stackName: 'bastion'
      },
      {
        id: '2',
        name: 'TestUser2',
        email: 'test@email.com',
        password: 'hashedPassword',
        stackName: 'bastion'
      },
      {
        id: '3',
        name: 'TestUser3',
        email: 'email@test.com',
        password: 'hashedPassword',
        stackName: 'bastion'
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

  test('Retrieves all users for given stackName', () => {
    const req = mockRequest;
    const res = mockResponse;

    axios.get.mockResolvedValue({
      data: users,
    });

    userController.getUsers(req, res)
      .then(allData => {
        expect(allData.length).toEqual(3);
        expect(allData[0].name).toEqual('TestUser1');
        expect(allData[1].name).toEqual('TestUser2');
        expect(allData[2].name).toEqual('TestUser3');
      });
  });

  test('Retrieves a single user by ID', () => {
    const req = mockRequest;
    req.params.id = '3';
    const res = mockResponse;

    axios.get.mockResolvedValue({
      data: users[2],
    });

    userController.getUsers(req, res)
      .then(user => {
        expect(user.id).toEqual('3');
        expect(user.name).toEqual('TestUser3');
      });
  });

  test('Creates a user with given information', () => {
    const req = mockRequest;
    req.body = {
      name: 'TestUser4',
      email: 'email@email.com',
      password: 'hashedPassword'
    };
    const res = mockResponse;

    axios.post.mockResolvedValue({
      data: {
        id: '4',
        name: 'TestUser4',
        email: 'email@email.com',
        password: 'hashedPassword',
        stackName: 'bastion'
      },
    });

    userController.createUser(req, res)
      .then(user => {
        expect(res.statusCode).toEqual(201);
        expect(user.id).toEqual('4');
        expect(user.name).toEqual('TestUser4');
      });
  });

  test('Updates a user with given information and ID', () => {
    const req = mockRequest;
    req.params.id = users[2].id;
    req.body = {
      name: 'TestUser300',
      email: 'email@test.com',
      password: 'hashedPassword'
    };
    const res = mockResponse;

    axios.put.mockResolvedValue({
      data: {
        id: '3',
        name: 'TestUser300',
        email: 'email@test.com',
        password: 'hashedPassword',
        stackName: 'bastion'
      },
    });

    userController.putUser(req, res)
      .then(user => {
        expect(res.statusCode).toEqual(201);
        expect(user.id).toEqual('3');
        expect(user.name).toEqual('TestUser300');
      });
  });

  test('Updates a user with given information and ID', () => {
    const req = mockRequest;
    req.params.id = users[2].id;
    const res = mockResponse;

    axios.delete.mockResolvedValue({
      data: {
        id: '3',
        name: 'TestUser3',
        email: 'email@test.com',
        password: 'hashedPassword',
        stackName: 'bastion'
      },
    });

    userController.deleteUser(req, res)
      .then(user => {
        expect(res.statusCode).toEqual(204);
        expect(user.id).toEqual('3');
        expect(user.name).toEqual('TestUser3');
      });
  });
});
