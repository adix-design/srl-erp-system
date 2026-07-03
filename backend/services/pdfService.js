const puppeteer = require('puppeteer');
const templates = require('./pdfTemplates');

async function generatePDFBuffer(type, data) {
  let html = '';
  switch (type.toLowerCase()) {
    case 'invoice':
    case 'tax_invoice':
      html = templates.renderTaxInvoice(data);
      break;
    case 'quotation':
      html = templates.renderQuotation(data);
      break;
    case 'lr':
    case 'lorry_receipt':
      html = templates.renderLR(data);
      break;
    case 'receipt':
    case 'money_receipt':
      html = templates.renderMoneyReceipt(data);
      break;
    default:
      throw new Error('Invalid document type: ' + type);
  }

  // Launch Puppeteer with standard configuration for server execution
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Load the HTML content
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate A4 PDF with exact print background configuration
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });

    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF with Puppeteer:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

function getHTMLTemplate(type, data) {
  switch (type.toLowerCase()) {
    case 'invoice':
    case 'tax_invoice':
      return templates.renderTaxInvoice(data);
    case 'quotation':
      return templates.renderQuotation(data);
    case 'lr':
    case 'lorry_receipt':
      return templates.renderLR(data);
    case 'receipt':
    case 'money_receipt':
      return templates.renderMoneyReceipt(data);
    default:
      throw new Error('Invalid document type: ' + type);
  }
}

module.exports = {
  generatePDFBuffer,
  getHTMLTemplate
};
