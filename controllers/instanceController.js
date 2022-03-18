const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const cloudformation = new aws.CloudFormation();

const createBaaS = (req, res, next) => {
  const template = fs.readFileSync(path.resolve(__dirname, '../utils/bastion-development.yaml'), 'utf8');
  const params = {
    StackName: 'CreateBaaSInstance',
    TemplateBody: template,
    Parameters: [
      {
        ParameterKey: 'VPCID',
        ParameterValue: process.env.VpcId
      },
      {
        ParameterKey: 'AppTierSubnet',
        ParameterValue: process.env.AppTierSubnet
      },
      {
        ParameterKey: 'DBTierSubnet',
        ParameterValue: process.env.DBTierSubnet
      },
      {
        ParameterKey: 'EFSSecurityGroup',
        ParameterValue: process.env.EFSSecurityGroup
      },
      {
        ParameterKey: 'SGAppServer',
        ParameterValue: process.env.SGAppServer
      },
      {
        ParameterKey: 'ALBListener',
        ParameterValue: process.env.ALBListener
      },
      {
        ParameterKey: 'SGDBServer',
        ParameterValue: process.env.SGDBServer
      },
      {
        ParameterKey: 'AppServerLG',
        ParameterValue: process.env.AppServerLG
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
