var AWS = require("aws-sdk");
var DDB = new AWS.DynamoDB();
exports.handler = function (event, context, callback) {
      var putParams = {
        TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
        Item: {
          connectionId: { S: event.requestContext.connectionId },
          screen_name: {S: event.queryStringParameters.screen_name}
          //screen_name: {S: 'test'}
        }
      };
      DDB.putItem(putParams, function (err) {
        callback(null, {
          statusCode: err ? 500 : 200,
          body: err ? "Failed to connect: " + JSON.stringify(err) : "Connected."
        });
      });
};