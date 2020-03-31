const requestHandler = (handler) => async (req, res, next) => {
  try {
    const output = await handler(req);
    const status = output.status !== undefined ? output.status : 200;
    res.status(status).json(output); // Pass the response status along with the output
  } catch (err) {
    const json = {
      errorCode: err.errorCode,
      errorMessage: err.message,
      details: err,
    };
    if(err.statusCode){
      err.httpCode = err.statusCode;
    }
    if(!err.httpCode) {
      err.httpCode = 500;
    }
    return res.status(err.httpCode).json(json);
  }
};

module.exports = requestHandler;
