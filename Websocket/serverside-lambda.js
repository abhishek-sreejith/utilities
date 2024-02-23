const { DynamoDBClient, PutItemCommand, DeleteItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
//const { } = require('@aws-sdk/lib-dynamodb');
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("@aws-sdk/client-apigatewaymanagementapi");

const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
//const apiGatewayManagementApiClient = new ApiGatewayManagementApiClient({ region: 'us-east-1' });

// Define the API Gateway Management API endpoint URL
const endpoint = 'https://c83a7c2edk.execute-api.us-east-1.amazonaws.com/production';

// Initialize the API Gateway Management API client
const apiGatewayManagementApiClient = new ApiGatewayManagementApiClient({
    region: 'us-east-1',
    apiVersion: '2018-11-29',
    endpoint: endpoint
});


exports.handler = async (event) => {
    const { requestContext, body } = event;
    const { routeKey, connectionId } = requestContext;

    try {
        // Handle WebSocket event based on route key
        switch (routeKey) {
            case "$connect":
                await addConnectionToDB(connectionId);
                break;
            case "$disconnect":
                await removeConnectionFromDB(connectionId);
                break;
            case "sendMessage":
                console.log("Received message:", body);
                //const message = JSON.stringify({ message: body });
                console.log("message: ",JSON.parse(body).message)
                await replyToClient(connectionId, JSON.parse(body).message);
                break;
            default:
                console.log("Unknown WebSocket event:", routeKey);
                break;
        }

        return { statusCode: 200 };
    } catch (error) {
        console.error("Error:", error);
        return { statusCode: 500, body: "Internal Server Error" };
    }
};

async function addConnectionToDB(connectionId) {
    const params = {
        TableName: process.env.CONNECTIONS_TABLE_NAME,
        Item: { connectionId : { S: connectionId }}
    };
    console.log(params)
    await dynamoDBClient.send(new PutItemCommand(params));
    console.log(`Connection ${connectionId} added to DynamoDB`);
}

async function removeConnectionFromDB(connectionId) {
    try {
        console.log("Connection disconnect function");
        const params = {
            TableName: process.env.CONNECTIONS_TABLE_NAME,
            Key: {
                'connectionId': { S: connectionId }
  }
        };
        console.log(params);
        await dynamoDBClient.send(new DeleteItemCommand(params));
        console.log("Finished deleting command");
        console.log(`Connection ${connectionId} removed from DynamoDB`);
    } catch (error) {
        console.error("Error removing connection from DynamoDB:", error);
        throw error; // Rethrow the error to propagate it up the call stack
    }
}
async function replyToClient(connectionId, message) {
    var sendMessage = ""
    if (message === "Hello world"){
        sendMessage = "Server says Hi"
    }
    try {
        await apiGatewayManagementApiClient.send(new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: sendMessage
        }));
        console.log(`Reply sent to client ${connectionId}: ${message}`);
    } catch (error) {
        console.error(`Error sending reply to client ${connectionId}: ${error.message}`);
    }
}


// async function broadcastMessage(message) {
//     const params = {
//         TableName: process.env.CONNECTIONS_TABLE_NAME
//     };
//     const connections = await dynamoDBClient.send(new ScanCommand(params));

//     // Send message to each connected client
//     await Promise.all(connections.Items.map(async ({ connectionId }) => {
//         try {
//             await apiGatewayManagementApiClient.send(new PostToConnectionCommand({
//                 ConnectionId: connectionId,
//                 Data: message
//             }));
//             console.log(`Message sent to client ${connectionId}: ${message}`);
//         } catch (error) {
//             console.error(`Error sending message to client ${connectionId}: ${error.message}`);
//         }
//     }));
// }
