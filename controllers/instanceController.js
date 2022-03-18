const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const cloudformation = new aws.CloudFormation();

const Instance = require('../models/instance');
const RulePriority = require('../models/listenerRulesPriority');

const newRulePriority = () => {
  return new Promise((resolve, reject) => {
    RulePriority.findOne({})
      .then(rulePriority => {
        const current = rulePriority.Current;
        const newValue = current + 1;

        RulePriority.findOneAndUpdate({}, { Current: newValue })
          .then(() => {
            resolve([false, newValue]);
          })
          .catch(err => {
            console.log(err);
            reject([err, null]);
          })
      })
      .catch(err => {
        console.log(err);
        reject([err, null]);
      });
  });
};

const createBaaS = async (req, res, next) => {
  const StackName = req.body.StackName;
  const TargetGroupName = StackName + 'TargetGroup';
  const TemplateBody = fs.readFileSync(path.resolve(__dirname, '../utils/bastion-development.yaml'), 'utf8');
  let rulePriority;

  try {
    rulePriority = await newRulePriority()
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }

  const [ err, rulePriorityValue ] = rulePriority;
  if (err) {
    console.log(err);
    return res.status(400).send(err);
  }

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
      },
      {
        ParameterKey: 'AppServerLG',
        ParameterValue: process.env.AppServerLG
      },
      {
        ParameterKey: 'ListenerRulePriority',
        ParameterValue: String(rulePriorityValue)
      },
      {
        ParameterKey: 'TargetGroupName',
        ParameterValue: TargetGroupName
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
        
        Instance.findByIdAndDelete(req.params.id)
          .then(result => {
            res.status(200).json(result);
          })
          .catch(err => {
            console.log(err);
            res.status(400).send(err);
          });
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
