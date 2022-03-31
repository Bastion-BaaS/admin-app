const RulePriority = require('../models/listenerRulesPriority');
const HttpError = require('../models/httpError');
const config = require('./config');

const createURL = (stackName, path) => {
  if (process.env.NODE_ENV === 'development') {
    return `http://app-server:3001/server/${stackName}${path}`;
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
    const AppTaskFamily = stackName + 'TaskApp';
    const DBTaskFamily = stackName + 'TaskDB';
    const RoutingPath = `/server/${stackName}/*`;
    const DBHost = `db.${stackName}`;
    const stackParams = config.APP_SERVER_PARAMS

    newRulePriority()
      .then(rulePriority => resolve({
        StackName: stackName,
        TemplateBody,
        Parameters: [
          {
            ParameterKey: 'VPCID',
            ParameterValue: stackParams.VpcId
          },
          {
            ParameterKey: 'AppTierSubnet',
            ParameterValue: stackParams.AppTierSubnet
          },
          {
            ParameterKey: 'DBTierSubnet',
            ParameterValue: stackParams.DBTierSubnet
          },
          {
            ParameterKey: 'EFSSecurityGroup',
            ParameterValue: stackParams.EFSSecurityGroup
          },
          {
            ParameterKey: 'SGAppServer',
            ParameterValue: stackParams.SGAppServer
          },
          {
            ParameterKey: 'ALBListener',
            ParameterValue: stackParams.ALBListener
          },
          {
            ParameterKey: 'SGDBServer',
            ParameterValue: stackParams.SGDBServer
          },
          {
            ParameterKey: 'AppServerLG',
            ParameterValue: stackParams.AppServerLG
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
          {
            ParameterKey: 'RoleAppServer',
            ParameterValue: stackParams.RoleAppServer
          },
          {
            ParameterKey: 'RoleDBServer',
            ParameterValue: stackParams.RoleDBServer
          },
          {
            ParameterKey: 'AppTaskFamily',
            ParameterValue: AppTaskFamily
          },
          {
            ParameterKey: 'DBTaskFamily',
            ParameterValue: DBTaskFamily
          }
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
