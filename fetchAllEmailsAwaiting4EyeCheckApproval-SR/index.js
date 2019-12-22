'use strict';
const AWS = require('aws-sdk');
    exports.handler = async (event, context) => {
        let responseBody = "";
        let statusCode = 0;    
        var documentClient = new AWS.DynamoDB.DocumentClient();
        var params = {
          TableName : process.env.EMAILS_RECEIVED_TABLE,
          IndexName: process.env.FOUR_EYE_CHECK_READY_INDEX,
          FilterExpression : 'four_eye_check_ready = :fcheck',
          ExpressionAttributeValues : {':fcheck' : 'Y'}
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
            headers:{
                "Content-Type": "application/json",
                "access-control-allow-origin": "*"
            },
            body: responseBody
        }
        return response; 
}