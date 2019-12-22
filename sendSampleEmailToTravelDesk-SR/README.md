## Deployment instructions
Go to sendSampleEmailToTravelDesk-SR folder 
Package sendSampleEmailToTravelDesk-SR function using the following command "zip -r function.zip index.js"
Deploy function.zip on Lambda console.


Post Deploying the Lambda Function, you need to set the following environment variables

DUMMY_CUSTOMER_EMAIL  = awsdemo.kt@gmail.com
RECIPIENT_EMAIL = traveldesk@humarabajaj.com
SAMPLE_EMAILS_DELIVERED_TABLE = SmartResponder_SampleEmailsDelivered
SAMPLE_EMAILS = SmartResponder_SampleEmails