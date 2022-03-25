const RulePriority = require('../models/listenerRulesPriority');
const HttpError = require('../models/httpError');

const createURL = (stackName, path) => {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3001/server/${stackName}${path}`;
  }
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

const createParams = (stackName, apiKey, TemplateBody, stackBucketName) => {
  return new Promise((resolve, reject) => {
    const TargetGroupName = stackName + 'TargetGroup';
    const ClusterName = stackName + 'Cluster';
    const RoutingPath = `/server/${stackName}/*`;
    const DBHost = `db.${stackName}`;
    console.log(DBHost);

    newRulePriority()
      .then(rulePriority => resolve({
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
            ParameterKey: 'StackBucketName',
            ParameterValue: stackBucketName
          },
          {
            ParameterKey: 'RoutingPath',
            ParameterValue: RoutingPath
          },
          {
            ParameterKey: 'ApiKey',
            ParameterValue: apiKey
          },
          {
            ParameterKey: 'DBHost',
            ParameterValue: DBHost
          },
        ],
        Capabilities: ['CAPABILITY_NAMED_IAM']
      }))
      .catch(err => reject(err));
  });
};

const isValidStackName = (stackName) => {
  return /^[A-Za-z0-9-_]*$/.test(stackName);
};

exports.createURL = createURL;
exports.createParams = createParams;
exports.isValidStackName = isValidStackName;
