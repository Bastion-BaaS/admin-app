const RulePriority = require('../models/listenerRulesPriority');
const HttpError = require('../models/httpError');

const createURL = (stackName, path) => {
  return `http://app-server.${stackName}:3001/server/${stackName}${path}`;
};

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

const createParams = async (stackName, apiKey, TemplateBody) => {
  const TargetGroupName = stackName + 'TargetGroup';
  const ClusterName = stackName + 'Cluster';
  const RoutingPath = `/server/${stackName}/*`;
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

exports.createURL = createURL;
exports.createParams = createParams;