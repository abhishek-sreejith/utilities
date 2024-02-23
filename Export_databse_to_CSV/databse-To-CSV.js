const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const fs = require('fs');

// Set the AWS region and DynamoDB endpoint (if applicable)
//const region = 'your-region';
// If using DynamoDB locally, uncomment the line below and replace 'http://localhost:8000' with your local endpoint
// const endpoint = 'http://localhost:8000';

// Create a DynamoDB client
const client = new DynamoDBClient({});

// Params to scan the DynamoDB table
const params = {
  TableName: 'products-table',
};

// Function to scan the DynamoDB table and export data to CSV
async function exportToCsv() {
  try {
    // Scan the DynamoDB table
    const { Items } = await client.send(new ScanCommand(params));

    // Extract column headers
    const headers = Object.keys(Items[0]);

    // Write headers to CSV file
    const csvData = [headers.join(',')];

    // Append data rows to CSV
    Items.forEach(item => {
      const values = headers.map(header => {
        const value = item[header].S || item[header].N || '';
        return `"${value.replace(/"/g, '""')}"`; // Escape double quotes
      });
      csvData.push(values.join(','));
    });

    // Write CSV data to file
    fs.writeFileSync('output.csv', csvData.join('\n'));

    console.log('CSV file generated successfully.');
  } catch (error) {
    console.error('Error exporting data to CSV:', error);
  }
}

// Call the function to export data to CSV
exportToCsv();
