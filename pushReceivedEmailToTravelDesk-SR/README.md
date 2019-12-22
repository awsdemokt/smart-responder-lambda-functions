## Deployment instructions
Go to pushReceivedEmailToTravelDesk-SR folder 
Package pushReceivedEmailToTravelDesk-SR function using the following command "zip -r function.zip index.js"
Deploy function.zip on Lambda console.


Post Deploying the Lambda Function, you need to set the following environment variables

EMAIL_QUEUE_SCREEN  = email_queue
WEBSOCKET_CONNECTIONS_TABLE          = SmartResponder_WebSocketConnections
EMAILS_RECEIVED_TABLE = SmartResponder_EmailsReceived
WEBSOCKET_CONNECTION_URL  = https://68pbuxguch.execute-api.us-west-2.amazonaws.com/dev/@connections