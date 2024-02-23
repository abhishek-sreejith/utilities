const fs = require('fs');
const pdf = require('html-pdf');

// Read the HTML content from the input HTML file
const htmlContent = fs.readFileSync('HTML-PDF-Convert/index.html', 'utf8');

// Configuration options for PDF generation
const options = {
    format: 'Letter',
    border: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
    }
};

// Convert HTML content to PDF
pdf.create(htmlContent, options).toFile('output2.pdf', (err, res) => {
    if (err) {
        console.error('Error converting HTML to PDF:', err);
    } else {
        console.log('PDF generated successfully at', res.filename);
    }
});
