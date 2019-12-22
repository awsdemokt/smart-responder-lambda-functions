'use strict';
const AWS = require('aws-sdk');
exports.handler = async (event, context) => {
    const { emailId } = event.queryStringParameters;
    let responseBody = "";
    let statusCode = 0;
    const documentClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        Key: { 
            "id" : emailId
        },
        TableName: process.env.EMAILS_RECEIVED_TABLE,
    };
    try{
        const data = await documentClient.get(params).promise();
        responseBody = JSON.stringify(data.Item);
        statusCode = 200;
    }catch(error){
        responseBody = `Unable to get sample emails ${error}`;
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