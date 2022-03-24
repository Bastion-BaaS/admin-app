const aws = require('aws-sdk');
const stream = require('stream');
const fs = require('fs');
const path = require('path')
const s3 = new aws.S3();
const iam = new aws.IAM();
const cloudformation = new aws.CloudFormation();
const template = fs.readFileSync(path.resolve(__dirname, './CCFTemplate.yaml'), 'utf8');

const uploadStream = ({ Bucket, Key }) => {
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: s3.upload({ Bucket, Key, Body: pass }).promise(),
  };
};

const getRoleCCFArn = () => {
  const params = { RoleName: 'RoleCCF' };
  let role = {};
  iam.getRole(params, (err, data) => {
    if (err) {
      console.error(err, err.stack);
      role.error = err;
    } else {
      role.arn = data.Arn;
    }
  });
  return role;
};

const uploadZipToS3 = async (bucketName, functionName) => {
  // Key should be `functionName.zip` but for now its harcoded
  let upload = {};
  const { writeStream, promise } = uploadStream({ Bucket: bucketName, Key: 'ccf/bastion-test.zip' });
  // temporary this should come from front-end
  const zipPath = path.resolve(__dirname, './bastion-test.zip');
  const readStream = fs.createReadStream(zipPath);
  readStream.pipe(writeStream);

  try {
    await promise;
    console.log('upload is successful');
    upload.success = true;
  } catch(err) {
    console.error('upload failed', err.message);
    upload.error = err;
  }
  return upload;
};

const createLambda = (ccfName, ccfBucketName) => {
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
        // Replace when front-end integration is complete
        // CCFZipFileName: `ccf/${ccfName}`,
        ParameterValue: 'ccf/bastion-test.zip'
      },
      {
        ParameterKey: 'CCFRoleArn',
        ParameterValue: roleResult
      }
    ],
    TemplateBody: template,
    Capabilities: ['CAPABILITY_NAMED_IAM']
  };

  let result;
  cloudformation.createStack(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      result = {error: err};
    }
  });
  return result;
};

const removeLambda = async (ccfName, ccfBucketName) => {
  let cfParams = {
    StackName: ccfName
  };
  let s3Params = {
    Bucket: ccfBucketName,
    // Key: `ccf/${ccfName}.zip`,
    Key: `ccf/bastion-test.zip`
  }
  let result;
  s3.deleteObject(s3Params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      result = { error: err };
      return result;
    } else {
      console.log(`object deletion is being handled: ${data}`);
    }
  });
  cloudformation.deleteStack(cfParams, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      result = { error: err };
    } else {
      result = 'success';
    }
  })
  return result;
};


module.exports = {
  getRoleCCFArn,
  uploadZipToS3,
  createLambda,
  removeLambda
};
