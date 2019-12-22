'use strict';
const AWS = require('aws-sdk');
exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    var emailId = event.emailId;
    var reply = event.reply;
    let responseBody = "";
    let statusCode = 0;
    let current_datetime = new Date();
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds(); 
    try{
        var params = {
            Key: { 
                "id" : emailId
            },
            TableName: process.env.EMAILS_RECEIVED_TABLE,
        }
        //Received email record
        var data = await documentClient.get(params).promise();
        const target_language_code = data.Item.source_language_code;
        var translate = new AWS.Translate();
        var params = {
            SourceLanguageCode: 'en',
            TargetLanguageCode: target_language_code,
            Text: reply,
        };
        var translateddata = await translate.translateText(params).promise();
        params = {
            TableName: process.env.EMAILS_RECEIVED_TABLE,
            Key:{
                "id":emailId
            },
            ExpressionAttributeNames: {
                "#O": "original_reply", 
                "#T": "translated_reply",
                "#D": "reply_drafted_date",
                "#R": "reply_sent",
                "#F": "four_eye_check_ready"
            },
            ExpressionAttributeValues: {
                ":o": reply,
                ":t": translateddata.TranslatedText,
                ":d": formatted_date,
                ":r": "Y",
                ":f": "Y"
            }, 
            UpdateExpression: "set #O = :o, #T = :t, #D = :d, #R = :r, #F = :f",
            ReturnValues: "UPDATED_NEW"
        };
        var updatedata = await documentClient.update(params).promise();
        var response = emailId;
    }catch(error){
        responseBody = `Unable to put sample email ${error}`;
        statusCode = 403;
    }
    return response;
}