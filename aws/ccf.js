const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path')
const s3 = new aws.S3();
const iam = new aws.IAM();
const cloudformation = new aws.CloudFormation();
const template = fs.readFileSync(path.resolve(__dirname, './CCFTemplate.yaml'), 'utf8');
const config = require('../utils/config');
const stackParams = config.APP_SERVER_PARAMS;

const getRoleCCFArn = async () => {
  const params = { RoleName: 'RoleCCF' };
  return iam.getRole(params).promise();
};

const uploadZipToS3 = async (bucketName, functionName, file) => {
  const uploadOptions = {
    Bucket: bucketName,
    Key: `${functionName}.zip`,
    Body: file,
  }
  return s3.upload(uploadOptions).promise();
};

const createLambda = async (ccfName, ccfBucketName, ccfRole) => {
  let params = {
    StackName: ccfName,
    Parameters: [
      {
        ParameterKey: 'CCFName',
        ParameterValue: ccfName
      },
      {
        ParameterKey: 'CCFBucketName',
        ParameterValue: ccfBucketName
      },
      {
        ParameterKey: 'CCFZipFileName',
        ParameterValue: `${ccfName}.zip`,
      },
      {
        ParameterKey: 'CCFRoleArn',
        ParameterValue: ccfRole
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
        ParameterKey: 'SGCCF',
        ParameterValue: stackParams.SGCCF
      }
    ],
    TemplateBody: template,
    Capabilities: ['CAPABILITY_NAMED_IAM']
  };

  return cloudformation.createStack(params).promise();
};

const removeLambda = async (ccfName, ccfBucketName) => {
  let ccfParams = {
    StackName: ccfName
  };
  let s3Params = {
    Bucket: ccfBucketName,
    Key: `${ccfName}.zip`,
  }
  try {
    await s3.deleteObject(s3Params).promise();
  } catch(err) {
    console.log(err, 's3 deletion failed');
    return;
  }
  return cloudformation.deleteStack(ccfParams).promise()
};


module.exports = {
  getRoleCCFArn,
  uploadZipToS3,
  createLambda,
  removeLambda
};
