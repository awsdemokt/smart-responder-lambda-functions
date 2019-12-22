'use strict'
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    console.log(JSON.stringify(`Event: event`))
    const dynamodbClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    const params = {
        TableName: process.env.SAMPLE_EMAILS_TABLE
    };
    try{
        const data = await dynamodbClient.scan(params).promise();
        responseBody = JSON.stringify(data.Items);
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
    console.log("return reponse from Smart Responder Sample Emails Get " + JSON.stringify(response));
    return response; 
};