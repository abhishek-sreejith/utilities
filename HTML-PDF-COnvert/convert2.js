const PDFDocument = require('pdfkit');
const fs = require('fs');
const handlebars = require('handlebars');
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.REGION });
const s3 = new AWS.S3();

module.exports.generatePDF = async (event) => {
  // Define your dynamic data
  let dynamicData = {
    title: 'Default Title',
    heading: 'Default Heading',
    content: 'Default Content',
  };

  // Check if the request has a body and parse it as JSON
  if (event.body) {
    try {
      const requestBody = JSON.parse(event.body);

      // Merge the dynamic data from the request with the default data
      dynamicData = { ...dynamicData, ...requestBody };
    } catch (error) {
      console.error('Error parsing request body:', error);
    }
  }
  // Read the HBS template file
  const source = await fs.promises.readFile('handlers/template.hbs', 'utf8');

  // Compile the template
  const template = handlebars.compile(source);

  // Render the template with the dynamic data
  const htmlContent = template(dynamicData);

  // Create a document
  const doc = new PDFDocument();

  // Pipe its output to a writable stream
  const pdfStream = doc.pipe(fs.createWriteStream('/tmp/output.pdf'));

  // Convert HTML content to PDF
  doc.text(dynamicData.title, 100, 100);
  doc.text(dynamicData.heading, 100, 150);
  doc.text(dynamicData.content, 100, 200);

  // End the document
  doc.end();

  return new Promise(async (resolve, reject) => {
    pdfStream.on('finish', async () => {
      try {
        const pdfData = await fs.promises.readFile('/tmp/output.pdf');

        // Upload the PDF to S3
        await s3.upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: 'pdfs/test.pdf',
          Body: pdfData,
          ContentType: 'application/pdf',
        }).promise();

        resolve({
          statusCode: 201,
          body: JSON.stringify({message: 'PDF generated and uploaded successfully!'}),
        });
      } catch (error) {
        console.error('Error:', error);
        reject(error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        };
      }
    });
  });
};