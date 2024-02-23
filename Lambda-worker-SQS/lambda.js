const { SQSClient, DeleteMessageCommand } = require('@aws-sdk/client-sqs');

// Create an SQS client
const sqsClient = new SQSClient({ region: 'us-east-1' }); // Change the region if needed

exports.handler = async (event) => {
    try {
        const records = event.Records;

        for (const record of records) {
            const message = JSON.parse(record.body);
            console.log('Processing message:', message);
        
            // Simulate job processing
            await processJob(message);

            // Delete the message from the queue after processing
            await deleteMessage(record.receiptHandle);
        }

        return {
            statusCode: 200,
            body: 'Messages processed successfully'
        };
    } catch (error) {
        console.error('Error processing messages:', error);
        throw error;
    }
};

async function processJob(message) {
    // Implement your job processing logic here
    console.log('Processing job:', message.messageBody.jobId);
    const params = {
        TableName: "products-table",
        Item: message.parameter,
    };
    try {
        await dynamoDbClient.send(new PutCommand(params));
        res.json({message:"Successfully added"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not add to carts" });
     }
    // Simulate job processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
}

async function deleteMessage(receiptHandle) {
    const command = new DeleteMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL,
        ReceiptHandle: receiptHandle
    });

    await sqsClient.send(command);
    console.log('Message deleted from the queue');
}
