const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const cloudformation = new aws.CloudFormation();
const nanoid = require('nanoid');

const Instance = require('../models/instance');
const RulePriority = require('../models/listenerRulesPriority');
const HttpError = require('../models/httpError');

const newRulePriority = () => {
  return new Promise((resolve, reject) => {
    RulePriority.findOne({})
      .then(rulePriority => {
        const current = rulePriority.Current;
        const newValue = current + 1;

        RulePriority.findOneAndUpdate({}, { Current: newValue })
          .then(() => resolve(newValue))
          .catch(err => reject(new HttpError(err, 500)))
      })
      .catch(err => reject(new HttpError(err, 500)));
  });
};

const createParams = async (stackName, apiKey) => {
  const TargetGroupName = stackName + 'TargetGroup';
  const ClusterName = stackName + 'Cluster';
  const RoutingPath = `/server/${stackName}/*`;
  const TemplateBody = fs.readFileSync(path.resolve(__dirname, '../utils/bastion-development.yaml'), 'utf8');
  let rulePriority;
  try {
    rulePriority = await newRulePriority();
  } catch (err) {
    throw err;
  }

  return {
    StackName: stackName,
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
      },
      {
        ParameterKey: 'AppServerLG',
        ParameterValue: process.env.AppServerLG
      },
      {
        ParameterKey: 'ListenerRulePriority',
        ParameterValue: String(rulePriority)
      },
      {
        ParameterKey: 'TargetGroupName',
        ParameterValue: TargetGroupName
      },
      {
        ParameterKey: 'ClusterName',
        ParameterValue: ClusterName
      },
      {
        ParameterKey: 'StackName',
        ParameterValue: stackName
      },
      {
        ParameterKey: 'RoutingPath',
        ParameterValue: RoutingPath
      },
      {
        ParameterKey: 'ApiKey',
        ParameterValue: apiKey
      },
    ],
    Capabilities: ['CAPABILITY_NAMED_IAM']
  };
};

const createBaaS = async (req, res, next) => {
  const apiKey = nanoid.nanoid();
  let params;
  try {
    params = await createParams(req.body.name, apiKey, next);
  } catch (err) {
    return next(err);
  }

  cloudformation.createStack(params, (err, data) => {
    if (err) {
      return next(new HttpError(err, 500));
    }

    const newInstance = {
      StackName: req.body.name,
      StackId: data.StackId,
      ApiKey: apiKey,
    }

    Instance.create(newInstance)
      .then(createdInstance => res.status(200).json(createdInstance))
      .catch(err => next(new HttpError(err, 500)));
  });
};

const destroyBaaS = (req, res, next) => {
  Instance.findById(req.params.id)
    .then(instance => {
      const params = { StackName: instance.StackName };
      cloudformation.deleteStack(params, (err, data) => {
        if (err) {
          return next(new HttpError(err, 500));
        }
        
        Instance.findByIdAndDelete(req.params.id)
          .then(result => res.status(200).json(result))
          .catch(err => next(new HttpError(err, 500)));
      });
    })
    .catch(err => next(new HttpError(err, 500)));
};

const getBaaSInstances = (req, res, next) => {
  Instance.find({})
    .then(instances => res.json(instances))
    .catch(err => next(new HttpError(err, 500)));
};

const getBaaSInstance = (req, res, next) => {
  Instance.findById(req.params.id)
    .then(instance => res.status(200).json(instance))
    .catch(err => next(new HttpError(err, 500)));
}

exports.createBaaS = createBaaS;
exports.destroyBaaS = destroyBaaS;
exports.getBaaSInstances = getBaaSInstances;
exports.getBaaSInstance = getBaaSInstance;
