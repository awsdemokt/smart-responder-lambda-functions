'use strict'
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
exports.handler = (event, context, callback) => {
    const s3 = new AWS.S3();
    const documentClient = new AWS.DynamoDB.DocumentClient();
    var uuid1 = uuidv1();
    var bucketName = event.detail.requestParameters.bucketName;
    var fileKey = event.detail.requestParameters.key
    var paramsS3 = {
        Bucket: bucketName,
        Key: fileKey
    };
    var emailReceived = "";
    s3.getObject(paramsS3, (err, data) => {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            emailReceived = data.Body;
            var MailParser = require("mailparser-mit").MailParser;
            var mailparser = new MailParser();
            mailparser.on("end", async function(mail_object) {
                const from = mail_object.from[0].address;
                const subject = mail_object.subject;
                const emailText = mail_object.text;
                let current_datetime = new Date();
                let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
                const paramsDynamoDB = {
                  TableName: process.env.EMAILS_RECEIVED_TABLE,
                    Item: {
                        id: uuid1,
                        mail_from: from,
                        subject: subject,
                        email_date: formatted_date,
                        email_text: emailText,
                        s3_object_key: fileKey,
                        reply_sent: 'N'
                    }
                };
                try{
                    const data = await documentClient.put(paramsDynamoDB).promise();
                    var result = {EmailId: uuid1, Status: "Success"};    
                }catch(error){
                    console.log(`error occurred while saving the samleple email ${error}`);
                    var result = {EmailId: "0", Status: "Fail"};    
                }
                callback(null,result);   
            });
            mailparser.write(emailReceived);
            mailparser.end();            
        }    
    });
}