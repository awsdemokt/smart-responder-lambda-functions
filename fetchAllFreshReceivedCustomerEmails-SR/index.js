'use strict';
const AWS = require('aws-sdk');
    exports.handler = async (event, context) => {
        let responseBody = "";
        let statusCode = 0;    
        var documentClient = new AWS.DynamoDB.DocumentClient();
        var params = {
          TableName : process.env.EMAILS_RECEIVED_TABLE,
          IndexName: process.env.EMAILS_RECEIVED_REPLY_SENT_INDEX,
          FilterExpression : 'reply_sent = :reply',
          ExpressionAttributeValues : {':reply' : 'N'}
        };
        try{
            const data = await documentClient.scan(params).promise();
            responseBody = JSON.stringify(data.Items);
            statusCode = 200;
        }catch(error){
            console.log(`Error while retreiving received emails ${error}`);
            responseBody = `Error while retreiving received emails ${error}`;
            statusCode = 403;
        }
        const response = {
            statusCode: statusCode,
            headers: {
                "Content-Type" : "application/json",
                "access-control-allow-origin": "*"
            },
            body: responseBody
        };
        return response; 
}