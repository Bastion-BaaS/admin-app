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
const RoleAppServer = process.env.RoleAppServer;
const RoleDBServer = process.env.RoleDBServer;
const ALBListener = process.env.ALBListener;
const AppServerLG = process.env.AppServerLG;
const SGCCF = process.env.SGCCF;
const AdminUsername = process.env.AdminUsername;
const AdminPassword = process.env.AdminPassword;
const APP_SERVER_PARAMS = {
  VpcId,
  DBTierSubnet,
  AppTierSubnet,
  EFSSecurityGroup,
  SGAppServer,
  SGDBServer,
  RoleAppServer,
  RoleDBServer,
  ALBListener,
  AppServerLG,
  SGCCF
};

const MONGO_CREDENTIALS = [
  _DB_USER,
  _DB_PASSWORD,
  _DB_HOST,
  _DB_PORT,
  _DB_NAME
];

const ADMIN_CREDENTIALS = {
  AdminUsername,
  AdminPassword
}

module.exports = {
  PORT,
  NODE_ENV,
  MONGO_CREDENTIALS,
  APP_SERVER_PARAMS,
  ADMIN_CREDENTIALS
};
