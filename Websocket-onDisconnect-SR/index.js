var AWS = require("aws-sdk");
var DDB = new AWS.DynamoDB();
exports.handler = function (event, context, callback) {
  var deleteParams = {
    TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
    Key: {
      connectionId: { S: event.requestContext.connectionId }
    }
  };

  DDB.deleteItem(deleteParams, function (err) {
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? "Failed to disconnect: " + JSON.stringify(err) : "Disconnected."
    });
  });
};