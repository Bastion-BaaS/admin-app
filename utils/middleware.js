const HttpError = require('../models/httpError');
const Instance = require('../models/instance');

const addApiKey = (req, res, next) => {
  const stackName = req.params.stackName;
  if (process.env.NODE_ENV === 'local') {
    req.axiosConfig = {
      headers: {
        'Authorization': 'Basic development',
        'X-REQUESTED-BY': 'admin-app',
        'Content-Type': 'application/json'
      }
    };
    return next();
  }

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

const errorMiddleware = (err, req, res) => {
  console.log(err);
  res.status(err.code || 500).json({ error: err.message || "An unknown error occured" });
}

exports.addApiKey = addApiKey;
exports.errorMiddleware = errorMiddleware;