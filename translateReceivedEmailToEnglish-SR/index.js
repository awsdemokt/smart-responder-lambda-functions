'use strict';
const AWS = require('aws-sdk');
exports.handler = async (event,context,callback) => {
    const emailId = event.EmailId;
    const status = event.Status;
    var documentClient = new AWS.DynamoDB.DocumentClient();
    var result = "";
    try{
        var params = {
            Key: { 
                "id" : emailId
            },
            TableName: process.env.EMAILS_RECEIVED_TABLE,
        }
        var data = await documentClient.get(params).promise();
        const email_text = data.Item.email_text;
        var translate = new AWS.Translate();
        var params = {
            SourceLanguageCode: 'auto',
            TargetLanguageCode: 'en',
            Text: email_text,
        };
        var translateddata = await translate.translateText(params).promise();
        var params1 = {
            TableName: process.env.EMAILS_RECEIVED_TABLE,
            Key:{
                "id":emailId
            },
            ExpressionAttributeNames: {
                "#TT": "translated_text", 
                "#LC": "source_language_code"
            },
            ExpressionAttributeValues: {
                ":t": translateddata.TranslatedText,
                ":c": translateddata.SourceLanguageCode
            }, 
            UpdateExpression: "set #TT = :t, #LC = :c",
            ReturnValues: "UPDATED_NEW"
        };
        data = await documentClient.update(params1).promise();
        result = {EmailId: emailId, Status: "Success"};    
    }catch(error){
        console.log(`could not update dynamodb table with translated text ${error}`);
        result = {EmailId: "0", Status: "Fail"};    
    }
    callback(null,result);   
}