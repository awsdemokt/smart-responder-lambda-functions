'use strict';
const AWS = require('aws-sdk');
exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    let current_datetime = new Date()
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
    const emailId = event;
    try{
        //Part-1: Get the email that has been 4 eye check approved.
        var params = {
            Key: { 
                "id" : emailId
            },
            TableName: process.env.EMAILS_RECEIVED_TABLE,
        };
        const data = await documentClient.get(params).promise();
        //Part-2: Send email to the customer who actually sent the email
        const recipient = data.Item.mail_from;
        const sender = process.env.SENDER_EMAIL;
        const subject = data.Item.subject + " - (Reply from SmartResponder TravelDesk)";
        const body_text = data.Item.translated_reply;
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
            console.log("Calling sendEmail DONE");    
        });
        statusCode = 201;
        
        //Part-3: Update email record that email reply has been sent.
        params = {
            TableName: process.env.EMAILS_RECEIVED_TABLE,
            Key:{
                "id":emailId
            },
            ExpressionAttributeNames: {
                "#R": "foureye_approvereply_sent"
            },
            ExpressionAttributeValues: {
                ":r": "Y"
            }, 
            UpdateExpression: "set #R = :r",
            ReturnValues: "UPDATED_NEW"
        };
        var updatedata = await documentClient.update(params).promise();
    }catch(error){
        console.log(`Issue while sending the final email reply to the customer ${error}`);
    }
};