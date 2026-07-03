const { google } = require('googleapis');

async function appendToGoogleSheet(sheetName, rowData) {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
    console.log(`⚠️  Google Sheets integration not fully configured. Skipping append to sheet "${sheetName}".`);
    console.log('Row Data that would have been saved:', rowData);
    return false;
  }

  try {
    // Format the private key if it has escaped newlines
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    const auth = new google.auth.JWT(
      serviceAccountEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Check sheet range (create if doesn't exist, or append directly)
    const range = `${sheetName}!A:Z`;
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    });

    console.log(`✅ Successfully appended row to Google Sheet: "${sheetName}"`);
    return true;
  } catch (error) {
    console.error(`❌ Google Sheets append error for "${sheetName}":`, error.message);
    return false;
  }
}

async function syncShipmentToSheets(shipment) {
  // Sync details to Shipments sheet
  const shipmentRow = [
    new Date(shipment.createdAt || Date.now()).toLocaleDateString('en-IN'),
    shipment.lrNumber || '',
    shipment.invoiceNumber || '',
    shipment.receiptNumber || '',
    shipment.customerName || '',
    shipment.phone || '',
    shipment.pickupCity || '',
    shipment.deliveryCity || '',
    shipment.pickupAddress || '',
    shipment.deliveryAddress || '',
    shipment.truckNumber || '',
    shipment.amount || 0,
    shipment.goodsDescription || '',
    shipment.weight || '',
    shipment.paymentMode || '',
    shipment.deliveryType || '',
    shipment.status || 'Pending'
  ];

  // Sync to Customers sheet
  const customerRow = [
    shipment.customerName || '',
    shipment.phone || '',
    shipment.pickupCity || '',
    shipment.deliveryCity || '',
    new Date().toLocaleDateString('en-IN')
  ];

  // Sync to Payments sheet
  const paymentRow = [
    new Date().toLocaleDateString('en-IN'),
    shipment.invoiceNumber || '',
    shipment.customerName || '',
    shipment.amount || 0,
    shipment.paymentMode || '',
    shipment.receiptNumber || '',
    shipment.status === 'Delivered' ? 'Paid' : 'Pending'
  ];

  const results = await Promise.all([
    appendToGoogleSheet('Shipments', shipmentRow),
    appendToGoogleSheet('Customers', customerRow),
    appendToGoogleSheet('Payments', paymentRow)
  ]);

  return results.some(Boolean);
}

module.exports = {
  syncShipmentToSheets,
  appendToGoogleSheet
};
