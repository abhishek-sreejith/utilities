const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const fs = require("fs");

// Set up the S3 client with AWS credentials
const s3Client = new S3Client({  // Replace "YOUR_REGION" with your AWS region
  //credentials: fromIni({ profile: "Abhishek-admin" }) // Replace "YOUR_PROFILE_NAME" with your AWS CLI profile name
});

// Define the parameters for uploading the document
const params = {
  Bucket: "u-uploadtos3", // Replace "YOUR_BUCKET_NAME" with the name of your S3 bucket
  Key: "output.csv", // Object key (file name)
  Body: fs.readFileSync("output.csv"), // Read the file contents
};

// Upload the document to S3
const uploadDocument = async () => {
  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log("Document uploaded successfully:", data);
  } catch (error) {
    console.error("Error uploading document:", error);
  }
};

// Call the function to upload the document
uploadDocument();
