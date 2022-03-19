const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const cloudformation = new aws.CloudFormation();
const nanoid = require('nanoid');

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
const createParams = async (stackName, appId) => {
  const TargetGroupName = stackName + 'TargetGroup';
  const ClusterName = stackName + 'Cluster';
  const RoutingPath = `/server/${appId}/*`;
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

  return {
    AppId: appId,
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
      },
      {
        ParameterKey: 'ClusterName',
        ParameterValue: ClusterName
      },
      {
        ParameterKey: 'NewNameSpace',
        ParameterValue: stackName
      },
      {
        ParameterKey: 'RoutingPath',
        ParameterValue: RoutingPath
      },
      {
        ParameterKey: 'AppId',
        ParameterValue: appId
      }
    ],
    Capabilities: ['CAPABILITY_NAMED_IAM']
  };
};

const createBaaS = async (req, res, next) => {
  const appId = nanoid.nanoid();
  const params = await createParams(req.body.name, appId);
  console.log(`params are: ${params}`);
  cloudformation.createStack(params, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }

    const newInstance = {
      StackName: req.body.name,
      StackId: data.StackId,
      AppId: appId,
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
