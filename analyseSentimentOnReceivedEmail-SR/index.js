'use strict';
const AWS = require('aws-sdk');
exports.handler = async (event,context,callback) => {
    const emailId = event.EmailId;
    const status = event.Status;
    var documentClient = new AWS.DynamoDB.DocumentClient();
    try{
        var params = {
            Key: { 
                "id" : emailId
            },
            TableName: process.env.EMAILS_RECEIVED_TABLE,
        }
        var data = await documentClient.get(params).promise();
        const translated_text = data.Item.translated_text;
        var comprehend = new AWS.Comprehend();
        params = {
            LanguageCode: 'en',
            TextList: [translated_text]
        };
        data = await comprehend.batchDetectSentiment(params).promise();
        var sentiments = [];
        var positive = data.ResultList[0].SentimentScore.Positive;
        positive = positive.toPrecision(4);
        sentiments.push(positive);
                
        var negative = data.ResultList[0].SentimentScore.Negative;
        negative = negative.toPrecision(4);
        sentiments.push(negative);
                
        var neutral = data.ResultList[0].SentimentScore.Neutral;
        neutral = neutral.toPrecision(4);
        sentiments.push(neutral);
                
        var mixed = data.ResultList[0].SentimentScore.Mixed;
        mixed = mixed.toPrecision(4);
        sentiments.push(mixed);
                
        const sentimentStatus = Math.max(...sentiments);     
                        
        var sentimentFlag = "";
        if(sentimentStatus == positive){
            sentimentFlag = "Positive";
        }else if(sentimentStatus == negative){
            sentimentFlag = "Negative";
        }else if(sentimentStatus == neutral){
            sentimentFlag = "Neutral";
        }else if(sentimentStatus == mixed){
            sentimentFlag = "Mixed";
        }
                       
        params = {
            TableName: process.env.EMAILS_RECEIVED_TABLE,
            Key:{
                "id":emailId
            },
            ExpressionAttributeNames: {
                "#P": "positive_sentiment_score", 
                "#N": "negative_sentiment_score",
                "#NG": "neutral_sentiment_score",
                "#M": "mixed_sentiment_score",
                "#FL": "sentiment_flag"
            },
            ExpressionAttributeValues: {
                ":p": positive,
                ":n": negative,
                ":ng": neutral,
                ":m": mixed,
                ":flag" : sentimentFlag
            }, 
            UpdateExpression: "set #P = :p, #N = :n, #NG = :ng, #M = :m, #FL = :flag",
            ReturnValues: "UPDATED_NEW"
        };
                
        var updatedata = await documentClient.update(params).promise();
        var result = {EmailId: emailId, Status: "Success"};    
    }catch(error){
        console.log(`error occured ${error}`);
        var result = {EmailId: "0", Status: "Fail"};    
    }
    callback(null,result);   
}