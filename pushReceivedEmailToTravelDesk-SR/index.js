'use strict';
const AWS = require('aws-sdk');
exports.handler = async (event, context,callback) => {
    const emailId = event.EmailId;
    const status = event.Status;
    const { WEBSOCKET_CONNECTIONS_TABLE } = process.env;
    var documentClient = new AWS.DynamoDB.DocumentClient();
    var result = "";
    try{
        var params = {
            Key: { 
                "id" : emailId
            },
            TableName: process.env.EMAILS_RECEIVED_TABLE
        };
        var data = await documentClient.get(params).promise();
        var email = data.Item;
        let connectionData = await documentClient.scan({ TableName: WEBSOCKET_CONNECTIONS_TABLE, ProjectionExpression: 'connectionId,screen_name' }).promise(); 
        const {WEBSOCKET_CONNECTION_URL} = process.env;
        const apigwManagementApi = new AWS.ApiGatewayManagementApi({apiVersion: '2018-11-29',endpoint: WEBSOCKET_CONNECTION_URL});
        const postCalls = connectionData.Items.map(async ({ connectionId,screen_name }) => {
            try {
                if(screen_name == process.env.EMAIL_QUEUE_SCREEN) {
                    await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(email) }).promise();
                }
            }catch (e) {
                if (e.statusCode === 410) {
                    console.log(`Found stale connection, deleting ${connectionId}`);
                    await documentClient.delete({ TableName: WEBSOCKET_CONNECTIONS_TABLE, Key: { connectionId } }).promise();
                } else {
                    throw e;
                }
            }
        });
        try {
            await Promise.all(postCalls);
        } catch (e) {
            return { statusCode: 500, body: e.stack };
        }
    }catch(error){
      console.log(`could not get an email object from the table ${error}`);
    }  
};