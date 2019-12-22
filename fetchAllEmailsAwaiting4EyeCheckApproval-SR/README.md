
## Deployment instructions
Package function (from the function directory) using the following command "zip -r function.zip index.js"
Deploy function.zip on Lambda console.

Post Deploying the Lambda Function, you need to set the following environment variables

EMAILS_RECEIVED_TABLE = SmartResponder_EmailsReceived
FOUR_EYE_CHECK_READY_INDEX = id-four_eye_check_ready-index
