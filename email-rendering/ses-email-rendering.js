const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const ejs = require("ejs");
const fs = require("fs");

// Configure AWS SDK
//const REGION = "your-region"; // Replace with your AWS region
const sesClient = new SESClient(/*{ region: REGION }*/);

// Load the EJS template
const template = fs.readFileSync("emailTemplate.ejs", "utf8");

// Define dynamic data
const dynamicData = { name: "Abhishek C Sreejith" }; // Example dynamic data

// Render the EJS template with dynamic data
const renderedTemplate = ejs.render(template, dynamicData);

// Define email parameters
const params = {
  Destination: {
    ToAddresses: ["abhisheksreejithabhi673@gmail.com"], // Replace with recipient's email
  },
  Message: {
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: renderedTemplate,
      },
    },
    Subject: {
      Charset: "UTF-8",
      Data: "Welcome to Our Platform", // Email subject
    },
  },
  Source: "abhisheksreejithabhi673@gmail.com", // Replace with sender's email
};

// Send the email
const sendEmail = async () => {
  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Email sent:", data);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

sendEmail();
