'use strict';
const AWS = require('aws-sdk');
exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    var emailId = event.emailId;
    let responseBody = "";
    let statusCode = 0;
    let current_datetime = new Date();
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds(); 
    try{
        var params = {
            TableName: process.env.EMAILS_RECEIVED_TABLE,
            Key:{
                "id":emailId
            },
            ExpressionAttributeNames: {
                "#F": "four_eye_check_ready"
            },
            ExpressionAttributeValues: {
                ":f": "COMPLETED"
            }, 
            UpdateExpression: "set #F = :f",
            ReturnValues: "UPDATED_NEW"
        };
        var updatedata = await documentClient.update(params).promise();
         statusCode = 201;
    }catch(error){
        responseBody = `Unable to update 4 eye check approved email ${error}`;
        statusCode = 403;
    }
    return emailId;
}