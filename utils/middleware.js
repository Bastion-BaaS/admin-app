const HttpError = require('../models/httpError');
const Instance = require('../models/instance');

const addApiKey = (req, res, next) => {
  const stackName = req.params.stackName;
  Instance.findOne({ StackName: stackName })
    .then(instance => {
      req.axiosConfig = {
        headers: {
          'Authorization': `Basic ${instance.ApiKey}`,
          'X-REQUESTED-BY': 'admin-app'
        }
      };
      next();
    })
    .catch(err => next(new HttpError(err, 500)));
};

exports.addApiKey = addApiKey;