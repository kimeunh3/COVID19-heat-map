
function sendJsonResponse(data, error) {
  let output = {
    status: 200,
    msg: 'success',
    data,
  };

  if (error) {
    output = {
      status: error,
      msg: data,
    };
  }
  return output;
}

module.exports = {
  sendJsonResponse,
};
