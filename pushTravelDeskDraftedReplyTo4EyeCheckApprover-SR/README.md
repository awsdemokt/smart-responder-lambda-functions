## Deployment instructions
Package function (from the function directory) using the following command "zip -r function.zip index.js"
Deploy function.zip on Lambda console.

Post Deploying the Lambda Function, you need to set the following environment variables

EMAILS_RECEIVED_TABLE = SmartResponder_EmailsReceived
WEBSOCKET_CONNECTIONS_TABLE = SmartResponder_WebSocketConnections
FOUREYE_APPROVAL_QUEUE_SCREEN = foureye_queue
WEBSOCKET_CONNECTION_URL = https://68pbuxguch.execute-api.us-west-2.amazonaws.com/dev/@connections
