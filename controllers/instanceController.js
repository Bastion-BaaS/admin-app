const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const Instance = require('../models/instance');
const cloudformation = new aws.CloudFormation();

const createBaaS = (req, res, next) => {
  const StackName = req.body.StackName;
  const TemplateBody = fs.readFileSync(path.resolve(__dirname, '../utils/bastion-instance-no-comments.yaml'), 'utf8');
  const params = {
    StackName,
    TemplateBody,
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
      }
    ],
    Capabilities: ['CAPABILITY_NAMED_IAM']
  };

  cloudformation.createStack(params, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }

    const newInstance = {
      StackName,
      StackId: data.StackId,
    }

    Instance.create(newInstance)
      .then(createdInstance => {
        res.status(200).json(createdInstance);
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      })
  });
};

const destroyBaaS = (req, res, next) => {
  Instance.findById(req.params.id)
    .then(instance => {
      const params = {
        StackName: instance.StackName
      };

      cloudformation.deleteStack(params, (err, data) => {
        if (err) {
          return res.status(400).send(err);
        }

        return res.status(200).json(data);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    })
};

const getBaaSInstances = (req, res, next) => {
  Instance.find({})
    .then(instances => {
      res.json(instances);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
};

const getBaaSInstance = (req, res, next) => {
  Instance.findById(req.params.id)
    .then(instance => {
      res.status(200).json(instance);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
}

exports.createBaaS = createBaaS;
exports.destroyBaaS = destroyBaaS;
exports.getBaaSInstances = getBaaSInstances;
exports.getBaaSInstance = getBaaSInstance;