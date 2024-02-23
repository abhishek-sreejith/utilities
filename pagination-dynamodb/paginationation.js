const { DynamoDB } = require('aws-sdk');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Initialize DynamoDB client
const dynamodb = new DynamoDB();

// Generate a random string of specified length
function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // Convert to hexadecimal format
        .slice(0, length); // Trim to desired length
}


exports.handler = async (event) => {
    try {
        const { nextToken } = JSON.parse(event.body); // Extract next token from request body

        // Perform query to retrieve data using next token
        // const params = {
        //     TableName: tableName,
        //     Limit: pageSize, // Limit the number of items per page
        //     ExclusiveStartKey: lastKey, // Start key for pagination
        //     KeyConditionExpression: "productId > :val",
        //     ExpressionAttributeValues: {
        //         ":val": { N: "0" } // Start querying from productId greater than 0
        //     },
        //     ScanIndexForward: true // Sort the results in ascending order by productId
        // };
        const secretKey = generateRandomString(32)
        const params = {
            // Set your query parameters here
            TableName: tableName,
            Limit: pageSize, // Limit the number of items per page
            KeyConditionExpression: "productId > :val",
            ExpressionAttributeValues: {
                ":val": { N: "0" } // Start querying from productId greater than 0
            },
            ScanIndexForward: true, // Sort the results in ascending order by productId
            NextToken: nextToken // Use next token from request
        };

        const result = await dynamodb.query(params).promise();
        const unmarshalledData = result.Items.map(item => DynamoDB.Converter.unmarshall(item));

        // Generate JWT token containing the next token
        const jwtToken = jwt.sign({ nextToken: result.LastEvaluatedKey }, 'your-secret-key');

        // Return data and JWT token
        return {
            statusCode: 200,
            body: JSON.stringify({ data: unmarshalledData, nextToken: jwtToken })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

        

       