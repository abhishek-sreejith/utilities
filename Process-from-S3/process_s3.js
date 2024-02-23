const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const csv = require("csv-parser");

const s3Client = new S3Client({ region: 'us-east-1' });
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    for (const record of event.Records) {
        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;
        //console.log(bucket , key)

        if (bucket !== 'u-uploadtos3' || key !== 'output.csv') {
            console.log('Skipping non-matching object:', bucket, key);
            continue;
        }

        console.log('Processing object:', bucket, key);

        // Download CSV file from S3
        try {
            // Download CSV file from S3
            const csvData = await downloadCsvFromS3(bucket, key);
            console.log(csvData)

            // Parse CSV data
            const data = await processCsv(csvData);
            console.log(data)

            // Store data into DynamoDB
            await insertIntoDynamoDB(data);
        } catch (error) {
            console.error('Error processing object:', error);
        }
    }
};

async function downloadCsvFromS3(bucket, key) {
    const params = { Bucket: bucket, Key: key };
    const { Body } = await s3Client.send(new GetObjectCommand(params));
    return Body;
}

async function processCsv(csvData) {
    return new Promise((resolve, reject) => {
        const data = [];
        csvData
            .pipe(csv())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

async function insertIntoDynamoDB(data) {
    for (const row of data) {
        try {
            const params = {
                TableName: 'product-table',
                Item: {
                    productId: { S: row.productId },
                    category: { S: row.category },
                    brand: { S: row.brand },
                    price: { N: row.price },
                    description: { S: row.description },
                    color: { S: row.color },
                    productName: { S: row.productName },
                }
            };
            await dynamoDBClient.send(new PutItemCommand(params));
        } catch (error) {
            console.error('Error inserting item into DynamoDB:', error);
        }
    }
}


