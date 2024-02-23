const fs = require('fs');
const PDFDocument = require('pdfkit');
const handlebars = require("handlebars")

const doc = new PDFDocument();
const source = fs.readFileSync('HTML-PDF-Convert/websocket.html', 'utf8');
const template = handlebars.compile(source);
const stream = fs.createWriteStream('example.pdf');
doc.pipe(stream);

doc.fontSize(12).text(template);

doc.end();

stream.on('finish', () => {
 console.log(`Here's your PDF!`);
});