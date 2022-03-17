const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const createBaaS = (req, res, next) => {
  const cloudformation = new aws.CloudFormation();
  const template = fs.readFileSync(path.resolve(__dirname, '../utils/bastion-instance-no-comments.yaml'), 'utf8');
  const params = {
    StackName: 'CreateBaaSInstance',
    TemplateBody: template,
    Parameters: [
      {
        ParameterKey: 'VPCID',
        ParameterValue: process.env.VpcId
      }
    ],
    Capabilities: ['CAPABILITY_NAMED_IAM']
  };

  cloudformation.createStack(params, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }

    return res.status(200).json(data);
  });
};

const testfs = (req, res, next) => {
  try {
    const template = fs.readFileSync(path.resolve(__dirname, '../utils/bastion-instance-no-comments.yaml'), 'utf8');
    res.send(template);
  } catch (err) {
    res.send(err);
  }
}

const destroyBaaS = (req, res, next) => {
  const body = req.body;
  const params = {
    StackName: 'TODO'
  };
  cloudformation.deleteStack(params, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }

    return res.status(200).json(data);
  });
};

const getBaaSInstances = (req, res, next) => {
  const params = {};
  cloudformation.listStacks(params, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }

    return res.status(200).json(data);
  });
};

const getBaaSInstance = (req, res, next) => {
  const id = req.params.id;
  cloudformation.describeStacks(params, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }

    return res.status(200).json(data);
  });
}

exports.createBaaS = createBaaS;
exports.destroyBaaS = destroyBaaS;
exports.getBaaSInstances = getBaaSInstances;
exports.getBaaSInstance = getBaaSInstance;
exports.testfs = testfs;