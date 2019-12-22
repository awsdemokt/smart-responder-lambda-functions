'use strict';
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    const id = event.id;
    var uuid1 = uuidv1();
    let current_datetime = new Date()
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 
    const params = {
        TableName: process.env.SAMPLE_EMAILS_DELIVERED_TABLE,
        Item: {
            id: uuid1,
            sample_email_id: id,
            date_sent: formatted_date
        }
    };
    try{
        const data = await documentClient.put(params).promise();
        responseBody = JSON.stringify(data);
        var params2 = {
            Key: { 
                "id" : id
            },
            TableName: process.env.SAMPLE_EMAILS,
        }
        const data2 = await documentClient.get(params2).promise();
        const sample_email_category = data2.Item.category;
        const sample_emailtext = data2.Item.emailtext;
        const sample_email_from = data2.Item.from;
        const sample_language = data2.Item.language;
        
        const sender = process.env.DUMMY_CUSTOMER_EMAIL;
        const recipient = process.env.RECIPIENT_EMAIL;
        const subject = sample_email_category + "-" + sample_language;
        const body_text = sample_emailtext;
        const charset = "UTF-8";
        var ses = new AWS.SES();
        var params1 = { 
              Source: sender, 
              Destination: { 
                ToAddresses: [
                  recipient 
                ],
              },
              Message: {
                Subject: {
                  Data: subject,
                  Charset: charset
                },
                Body: {
                  Text: {
                    Data: body_text,
                    Charset: charset 
                  }
                }
              }
        };
        await ses.sendEmail(params1).promise().then(()=>{
            console.log("Calling sendEmail DONEeeeeee-------------------->");    
        });
        statusCode = 201;
    }catch(error){
        responseBody = `Unable to put sample email ${error}`;
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
};