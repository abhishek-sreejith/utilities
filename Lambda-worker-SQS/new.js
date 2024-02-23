const AWS = require('aws-sdk');

const sqs = new AWS.SQS();

exports.handler = async (event) => {
    try {
        // Additional values to include in the message body
        const additionalValues = {
            foo: 'bar',
            baz: 'qux'
        };

        // Construct message body with additional values
        const messageBody = {
            jobId: "12345",
            parameters: { key: "value" },
            ...additionalValues // Spread additional values into the message body
        };

        // Define parameters for sending message to SQS
        const params = {
            QueueUrl: "https://sqs.us-east-1.amazonaws.com/517820982762/SampleQueue",
            MessageBody: JSON.stringify(messageBody)
        };

        // Send message to SQS
        await sqs.sendMessage(params).promise();
        console.log('Job enqueued successfully');

        return {
            statusCode: 200,
            body: 'Job enqueued successfully'
        };
    } catch (error) {
        console.error('Error enqueuing job:', error);
        throw error;
    }
};
