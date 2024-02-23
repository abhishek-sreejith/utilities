const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { fromIni } = require("@aws-sdk/credential-provider-ini");

// Create an SQS client
const sqsClient = new SQSClient({
  region: "us-east-1",
  credentials: fromIni({ profile: "default" }), // Change the profile if needed
});

const handler = async (event) => {
  try {
    
    const dyanmodata = {
      productId:"103",
      productName:"Headphones",
      category:"Electronics",
      brand: "Sony",
      price: 149.99,
      color: "White",
      stock: 80
    }

    const messageBody = {
      jobId: "12345",
      paramater: dyanmodata // Spread additional values into the message body
  };
    const params = {
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/517820982762/SampleQueue",
      MessageBody: JSON.stringify({messageBody}),
    };

    // Send message to SQS queue
    const command = new SendMessageCommand(params);
    await sqsClient.send(command);

    console.log("Job enqueued successfully");

    return {
      statusCode: 200,
      body: "Job enqueued successfully",
    };
  } catch (error) {
    console.error("Error enqueuing job:", error);
    throw error;
  }
};
handler()