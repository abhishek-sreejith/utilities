const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

// Set up the S3 client
const s3Client = new S3Client({ }); // Replace 'YOUR_REGION' with your AWS region

// Function to generate a pre-signed URL for an S3 object
const generatePresignedUrl = async (bucketName, objectKey, expirationTimeInSeconds) => {
    // Specify the parameters for the pre-signed URL
    const params = {
        Bucket: bucketName,
        Key: objectKey,
    };

    try {
        // Generate the pre-signed URL
        const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(params), { expiresIn: expirationTimeInSeconds });
        return signedUrl;
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        throw error;
    }
};

// Example usage:
const bucketName = 'u-uploadtos3-2'; // Replace 'YOUR_BUCKET_NAME' with your bucket name
const objectKey = 'newtext.txt'; // Replace 'example-object.txt' with the key of the object you want to generate the URL for
const expirationTimeInSeconds = 3600; // Expiration time in seconds (e.g., 1 hour)

generatePresignedUrl(bucketName, objectKey, expirationTimeInSeconds)
    .then((url) => {
        console.log('Pre-signed URL:', url);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
