const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const _DB_USER = process.env.DB_USER;
const _DB_PASSWORD = process.env.DB_PASSWORD;
const _DB_HOST = process.env.DB_HOST;
const _DB_PORT = process.env.DB_PORT;
const _DB_NAME = process.env.DB_NAME;
const VpcId = process.env.VpcId
const DBTierSubnet = process.env.DBTierSubnet;
const AppTierSubnet = process.env.AppTierSubnet;
const EFSSecurityGroup = process.env.EFSSecurityGroup;
const SGAppServer = process.env.SGAppServer;
const SGDBServer = process.env.SGDBServer;
const AppServerIAMRole = process.env.AppServerIAMRole;
const DBServerIAMRole = process.env.DBServerIAMRole;
const AppServerIAMRoleArn = process.env.AppServerIAMRoleArn;
const DBServerIAMRoleArn = process.env.DBServerIAMRoleArn;
const ALBListener = process.env.ALBListener;
const AppServerLG = process.env.AppServerLG;
const APP_SERVER_PARAMS = {
  VpcId,
  DBTierSubnet,
  AppTierSubnet,
  EFSSecurityGroup,
  DBTierSubnet,
  AppTierSubnet,
  EFSSecurityGroup,
  SGAppServer,
  SGDBServer,
  AppServerIAMRole,
  DBServerIAMRole,
  AppServerIAMRoleArn,
  DBServerIAMRoleArn,
  ALBListener,
  AppServerLG,
};

const MONGO_CREDENTIALS = [
  NODE_ENV,
  _DB_USER,
  _DB_PASSWORD,
  _DB_HOST,
  _DB_PORT,
  _DB_NAME
];

module.exports = {
  PORT,
  NODE_ENV,
  MONGO_CREDENTIALS,
  APP_SERVER_PARAMS,
};
