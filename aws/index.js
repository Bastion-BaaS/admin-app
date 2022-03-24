exports.handler = async (event) => {
  // Test making API calls later
  const customerName = event.name;
  const response = {
    statusCode: 200,
    body: JSON.stringify(`You want to do something with ${customerName}`)
  }
  return response;
};
