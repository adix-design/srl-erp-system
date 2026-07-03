// PDF Templates for SRL Group
// Deep Red: #B30000, Dark Navy: #0F172A, Light Gray: #F5F5F5

const getHeaderHTML = (title, docNumber, docDate, docLabel = 'No.') => {
  return `
    <div class="header-container">
      <div class="header-left">
        <h1 class="company-logo">SRL GROUP</h1>
        <p class="company-tagline">Shree Ram Packers & Movers</p>
        <p class="company-details">
          <strong>Regd Office:</strong> Plot No. 16, New T.T. Nagar, Neelbad, Bhopal, Madhya Pradesh – 462044<br/>
          <strong>GST No.:</strong> 23ALKPD0239M1Z9 | <strong>Regd No.:</strong> 49947/BPL/CE/2009<br/>
          <strong>Phone:</strong> 8839411883, 8815116069 | <strong>Email:</strong> contact@srlmovers.in | <strong>Web:</strong> www.srlmovers.in
        </p>
      </div>
      <div class="header-right">
        <div class="doc-title-badge">${title.toUpperCase()}</div>
        <table class="meta-table">
          <tr>
            <td><strong>${docLabel}:</strong></td>
            <td>${docNumber}</td>
          </tr>
          <tr>
            <td><strong>Date:</strong></td>
            <td>${new Date(docDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="divider-red"></div>
  `;
};

const getCommonStyles = () => {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body, html {
        font-family: 'Inter', sans-serif;
        color: #0F172A;
        background-color: #FFFFFF;
        font-size: 11px;
        line-height: 1.4;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        overflow: hidden;
        width: 210mm;
        height: 297mm;
      }

      .a4-container {
        width: 210mm;
        height: 297mm;
        padding: 12mm 8mm;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .content-area {
        flex-grow: 1;
      }

      /* Header styling */
      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      .header-left {
        flex: 2;
      }

      .header-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .company-logo {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 1px;
        color: #0F172A;
        line-height: 1;
      }

      .company-tagline {
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 2px;
        color: #B30000;
        margin-bottom: 6px;
        text-transform: uppercase;
      }

      .company-details {
        font-size: 11px;
        color: #5F6772;
        line-height: 1.4;
      }

      .doc-title-badge {
        background-color: #0F172A;
        color: #FFFFFF;
        padding: 5px 10px;
        font-size: 15px;
        font-weight: 750;
        letter-spacing: 1px;
        text-align: center;
        margin-bottom: 4px;
        width: 100%;
        max-width: 170px;
      }

      .meta-table {
        border-collapse: collapse;
        width: 100%;
        max-width: 170px;
      }

      .meta-table td {
        padding: 4px;
        font-size: 11px;
        border: 1px solid #AEB6BF;
      }

      .meta-table tr td:first-child {
        background-color: #F8FAFC;
        width: 45%;
      }

      .divider-red {
        height: 3px;
        background-color: #B30000;
        margin-bottom: 15px;
      }

      /* Address Section grid */
      .section-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 15px;
      }

      .info-card {
        border: 1px solid #AEB6BF;
        padding: 10px;
      }

      .info-card-header {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        color: #B30000;
        border-bottom: 1px solid #AEB6BF;
        padding-bottom: 4px;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
      }

      .info-card-body p {
        margin-bottom: 3px;
        font-size: 11px;
      }

      /* Shipment Info Bar for Tax Invoice */
      .shipment-info-bar {
        display: flex;
        background-color: #FFFFFF;
        border: 1px solid #AEB6BF;
        border-radius: 0;
        padding: 8px 12px;
        margin-bottom: 15px;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      .shipment-bar-card {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
      }

      .shipment-bar-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #5F6772;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      .shipment-bar-icon svg {
        width: 13px;
        height: 13px;
      }

      .shipment-bar-details {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .shipment-bar-label {
        font-size: 10px;
        font-weight: 500;
        color: #5F6772;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        line-height: 1;
        margin-bottom: 3px;
      }

      .shipment-bar-value {
        font-size: 11px;
        font-weight: 700;
        color: #1E293B;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.1;
      }

      .shipment-bar-divider {
        width: 1px;
        height: 18px;
        background-color: #AEB6BF;
        margin: 0 10px;
        flex-shrink: 0;
      }

      /* Modern Billing Layout for Tax Invoice */
      .billing-grid {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
        width: 100%;
      }
      .particulars-section {
        flex: 1.4;
        min-width: 0;
      }
      .particulars-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #AEB6BF;
      }
      .particulars-table th {
        background-color: #0F172A;
        color: #FFFFFF;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 12px;
        padding: 6px 8px;
        text-align: left;
        border: 1px solid #0F172A;
        letter-spacing: 0.5px;
      }
      .particulars-table th.amount-col,
      .particulars-table td.amount-col {
        text-align: right;
        width: 100px;
      }
      .particulars-table td {
        padding: 5.5px 8px;
        border: 1px solid #AEB6BF;
        font-size: 11px;
      }
      .particulars-table tr:nth-child(even) td {
        background-color: #F8FAFC;
      }
      .summary-section {
        flex: 1;
        min-width: 0;
      }
      .summary-card {
        border: 1px solid #AEB6BF;
        background-color: #FFFFFF;
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .summary-card-header {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        color: #B30000;
        border-bottom: 1.5px solid #AEB6BF;
        padding-bottom: 4px;
        margin-bottom: 4px;
        letter-spacing: 0.5px;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        padding: 2.5px 0;
      }
      .summary-row-label {
        color: #5F6772;
        font-weight: 500;
      }
      .summary-row-value {
        color: #0F172A;
        font-weight: 600;
        text-align: right;
      }
      .summary-row.total-row {
        border-top: 1.5px solid #0F172A;
        padding-top: 6px;
        margin-top: 2px;
      }
      .summary-row.total-row .summary-row-label {
        color: #B30000;
        font-weight: 700;
        font-size: 14px;
      }
      .summary-row.total-row .summary-row-value {
        color: #B30000;
        font-weight: 800;
        font-size: 20px;
      }
      .summary-words-box {
        margin-top: 10px;
        border: 1px solid #AEB6BF;
        background-color: #F8FAFC;
        padding: 8px;
        font-size: 11px;
      }

      /* Itemized Table */
      .item-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }

      .item-table th {
        background-color: #0F172A;
        color: #FFFFFF;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 12px;
        padding: 6px 8px;
        text-align: left;
        border: 1px solid #0F172A;
        letter-spacing: 0.5px;
      }

      .item-table th.amount-col, 
      .item-table td.amount-col {
        text-align: right;
        width: 120px;
      }

      .item-table td {
        padding: 6px 8px;
        border: 1px solid #AEB6BF;
        font-size: 11px;
      }

      .item-table tr:nth-child(even) td {
        background-color: #F8FAFC;
      }

      .totals-row td {
        font-weight: 600;
        border-top: 1.5px solid #0F172A;
      }

      .totals-row.grand-total td {
        font-size: 20px;
        font-weight: 700;
        color: #B30000;
        background-color: #F1F5F9 !important;
        border-bottom: 2px double #0F172A;
      }

      .amount-words-section {
        border: 1px solid #AEB6BF;
        padding: 8px;
        margin-bottom: 15px;
        background-color: #F8FAFC;
        font-size: 11px;
      }

      /* Bottom terms and bank details */
      .footer-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1.2fr;
        gap: 15px;
        margin-top: 15px;
      }

      .terms-section {
        font-size: 11px;
        color: #5F6772;
        line-height: 1.3;
      }

      .terms-section h3 {
        font-size: 12px;
        font-weight: 700;
        color: #0F172A;
        margin-bottom: 4px;
        text-transform: uppercase;
      }

      .terms-section ol {
        padding-left: 12px;
      }

      .bank-section {
        border: 1px solid #AEB6BF;
        padding: 8px;
        font-size: 11px;
        line-height: 1.4;
      }

      .bank-section h3 {
        font-size: 12px;
        font-weight: 700;
        color: #B30000;
        margin-bottom: 4px;
        text-transform: uppercase;
        border-bottom: 1px solid #AEB6BF;
        padding-bottom: 2px;
      }

      /* Signature panel */
      .signature-panel {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 30px;
        padding-top: 10px;
      }

      .signature-box {
        text-align: center;
        width: 150px;
      }

      .signature-box.company-sig {
        text-align: right;
        width: 200px;
      }

      .signature-line {
        border-top: 1px solid #5F6772;
        margin-top: 40px;
        padding-top: 4px;
        font-size: 10.5px;
        font-weight: 600;
        color: #5F6772;
        text-transform: uppercase;
      }

      .page-footer {
        border-top: 1px solid #AEB6BF;
        padding-top: 8px;
        text-align: center;
        font-size: 10.5px;
        color: #5F6772;
        display: flex;
        justify-content: space-between;
      }

      /* Specific adjustments for Money Receipt and LR */
      .receipt-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 15px;
        margin-bottom: 15px;
      }
      
      .receipt-text-body {
        font-size: 11px;
        line-height: 1.8;
        padding: 15px;
        border: 1px solid #AEB6BF;
        margin-bottom: 15px;
        background-color: #FCFCFC;
      }

      .receipt-text-body span.fill-field {
        border-bottom: 1px dotted #000000;
        font-weight: 600;
        padding: 0 8px;
        display: inline-block;
      }

      .lr-meta-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 10px;
      }

      .lr-meta-card {
        border: 1px solid #AEB6BF;
        padding: 8px;
        font-size: 11px;
      }

      /* LR Top Notice Header Grid */
      .lr-header-block {
        display: grid;
        grid-template-columns: 2.2fr 0.8fr 1.5fr;
        gap: 12px;
        border: 1px solid #AEB6BF;
        border-radius: 0;
        padding: 8px 10px;
        margin-bottom: 10px;
        background-color: #FFFFFF;
        align-items: center;
      }
      .lr-header-notice {
        display: flex;
        flex-direction: column;
      }
      .lr-header-risk {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #AEB6BF;
        border-right: 1px solid #AEB6BF;
        padding: 0 8px;
        text-align: center;
        height: 100%;
        min-height: 48px;
      }
      .lr-header-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 10.5px;
        line-height: 1.35;
      }

      /* LR Dual Signatures Card */
      .lr-signature-block {
        display: grid;
        grid-template-columns: 1fr 1fr;
        border: 1px solid #AEB6BF;
        border-radius: 0;
        background-color: #FFFFFF;
        margin-top: 10px;
      }
      .lr-sig-card {
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 145px;
      }
      .lr-sig-card-left {
        border-right: 1px solid #AEB6BF;
        text-align: center;
      }
      .lr-sig-card-right {
        text-align: center;
      }
    </style>
  `;
};

const renderTaxInvoice = (data) => {
  const amount = Number(data.amount || 0);
  const basicAmount = Math.round((amount / 1.18) * 100) / 100;
  const gstAmount = Math.round((amount - basicAmount) * 100) / 100;
  const halfGst = Math.round((gstAmount / 2) * 100) / 100;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tax Invoice - ${data.invoiceNumber || 'Draft'}</title>
      ${getCommonStyles()}
      <style>
        /* Increase body/content typography only for Tax Invoice */
        .info-card-body p {
          font-size: 11px !important;
        }
        .particulars-table td {
          font-size: 11px !important;
        }
        .summary-row {
          font-size: 11px !important;
        }
        .summary-words-box {
          font-size: 11px !important;
        }
        .summary-words-box strong {
          font-size: 11px !important;
        }
      </style>
    </head>
    <body>
      <div class="a4-container">
        <div class="content-area">
           ${getHeaderHTML('Tax Invoice', data.invoiceNumber || '4098', data.createdAt || new Date(), 'Invoice No')}
          
          <div class="section-grid" style="margin-bottom: 22px;">
            <div class="info-card">
              <div class="info-card-header">
                <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: #B30000; display: inline-block; vertical-align: middle; margin-right: 3px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span style="vertical-align: middle;">BILL TO</span>
              </div>
              <div class="info-card-body">
                <p><strong>Name:</strong> ${data.customerName}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Address:</strong> ${data.pickupAddress}</p>
                <p><strong>City/State/Pincode:</strong> ${data.pickupCity}</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card-header">
                <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: #B30000; display: inline-block; vertical-align: middle; margin-right: 3px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span style="vertical-align: middle;">DELIVERY</span>
              </div>
              <div class="info-card-body">
                <p><strong>Name:</strong> ${data.customerName}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Address:</strong> ${data.deliveryAddress}</p>
                <p><strong>City/State/Pincode:</strong> ${data.deliveryCity}</p>
              </div>
            </div>
          </div>

          <!-- Shipment Information Bar -->
          <div class="shipment-info-bar" style="margin-bottom: 22px;">
            <div class="shipment-bar-card">
              <div class="shipment-bar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <div class="shipment-bar-details">
                <span class="shipment-bar-label">Mode of Shipment</span>
                <span class="shipment-bar-value">By Surface</span>
              </div>
            </div>
            
            <div class="shipment-bar-divider"></div>
            
            <div class="shipment-bar-card">
              <div class="shipment-bar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon><polygon points="12 22.08 21 17.08 21 6.92 12 12 12 22.08"></polygon><polygon points="12 12 21 6.92 12 1.84 3 6.92 12 12"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <div class="shipment-bar-details">
                <span class="shipment-bar-label">Type of Shipment</span>
                <span class="shipment-bar-value">Household</span>
              </div>
            </div>
            
            <div class="shipment-bar-divider"></div>
            
            <div class="shipment-bar-card">
              <div class="shipment-bar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="13" y2="16"></line></svg>
              </div>
              <div class="shipment-bar-details">
                <span class="shipment-bar-label">Truck No.</span>
                <span class="shipment-bar-value">${data.truckNumber || 'N/A'}</span>
              </div>
            </div>
            
            <div class="shipment-bar-divider"></div>
            
            <div class="shipment-bar-card">
              <div class="shipment-bar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div class="shipment-bar-details">
                <span class="shipment-bar-label">LR No.</span>
                <span class="shipment-bar-value">${data.lrNumber || 'N/A'}</span>
              </div>
            </div>
            
            <div class="shipment-bar-divider"></div>
            
            <div class="shipment-bar-card">
              <div class="shipment-bar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div class="shipment-bar-details">
                <span class="shipment-bar-label">Delivery Type</span>
                <span class="shipment-bar-value">${data.deliveryType || 'Door Delivery'}</span>
              </div>
            </div>
          </div>

          <!-- Modern Dual-Column Billing Layout -->
          <div class="billing-grid" style="margin-bottom: 22px;">
            <!-- Left Side: Particulars Table -->
            <div class="particulars-section">
              <table class="particulars-table">
                <thead>
                  <tr>
                    <th style="width: 40px;">S.No</th>
                    <th>Particulars</th>
                    <th class="amount-col">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Freight Charges</td>
                    <td class="amount-col">${(amount * 0.7).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Packing Charges</td>
                    <td class="amount-col">${(amount * 0.1).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Unpacking Charges</td>
                    <td class="amount-col">${(amount * 0.05).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Loading Charges</td>
                    <td class="amount-col">${(amount * 0.05).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Unloading Charges</td>
                    <td class="amount-col">${(amount * 0.05).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Packing Material</td>
                    <td class="amount-col">${(amount * 0.05).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>Additional Charges</td>
                    <td class="amount-col">0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Right Side: Amount Summary Card -->
            <div class="summary-section">
              <div class="summary-card">
                <div class="summary-card-header">Amount Summary</div>
                <div class="summary-row">
                  <span class="summary-row-label">Sub Total</span>
                  <span class="summary-row-value">₹${amount.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-row-label">Insurance Coverage</span>
                  <span class="summary-row-value">₹0.00</span>
                </div>
                <div class="summary-row total-row">
                  <span class="summary-row-label">Total Amount</span>
                  <span class="summary-row-value">₹${amount.toFixed(2)}</span>
                </div>
              </div>

              <!-- Amount in Words -->
              <div class="summary-words-box">
                <strong style="color: #0F172A; display: block; font-size: 8px; text-transform: uppercase; margin-bottom: 2px;">Amount in Words</strong>
                <span style="color: #5F6772; font-weight: 500;">${data.amountInWords || 'Rupees Only'}</span>
              </div>
            </div>
          </div>

          <!-- Side-by-Side Info Blocks: Shipment Details & Important Note -->
          <div class="section-grid" style="margin-bottom: 25px;">
            <div class="info-card">
              <div class="info-card-header">Shipment Details</div>
              <div class="info-card-body">
                <p><strong>Total Weight:</strong> Full Truck Load (Approx. ${data.weight || '6000 kg'})</p>
                <p><strong>Package:</strong> N/A</p>
                <p><strong>Goods Description:</strong> ${data.goodsDescription || 'Used Household Goods'}</p>
                <p><strong>Reverse Charge:</strong> No</p>
                <p><strong>Payment Remark:</strong> ${data.deliveryType || 'Door Delivery'}</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card-header">Important Note</div>
              <div class="info-card-body" style="font-size: 11px; line-height: 1.5; color: #5F6772;">
                <p style="margin-bottom: 8px;">• Please keep your cash/jewellery and any important items in your custody.</p>
                <p style="margin-bottom: 0;">• Carrying liquor, gas cylinder, acid or any type of liquids (like ghee tin, oil etc.) is totally prohibited.</p>
              </div>
            </div>
          </div>

          <!-- Modern 3-Column Footer Layout -->
          <div class="footer-grid" style="grid-template-columns: 1.45fr 0.85fr 1.2fr;">
            <!-- Left Block: SRL Authorized Signature -->
            <div class="info-card" style="display: flex; flex-direction: column; justify-content: space-between; text-align: center; min-height: 145px; padding: 12px 10px;">
              <div class="info-card-header" style="text-align: center; border-bottom: 1px solid #AEB6BF; padding-bottom: 4px; margin-bottom: 6px;">FOR SHREE RAM PACKERS & MOVERS</div>
              <div style="flex-grow: 1; min-height: 60px;"></div>
              <div style="border-top: 1px solid #AEB6BF; width: 85%; margin: 0 auto 4px auto;"></div>
              <div style="font-size: 9.5px; color: #5F6772; font-weight: 600;">Authorised Signatory</div>
            </div>

            <!-- Center Block: Customer Signature -->
            <div class="info-card" style="display: flex; flex-direction: column; justify-content: space-between; text-align: center; min-height: 145px; padding: 12px 10px;">
              <div class="info-card-header" style="border-bottom: none; color: transparent; padding-bottom: 4px; margin-bottom: 6px;">&nbsp;</div>
              <div style="flex-grow: 1; min-height: 60px;"></div>
              <div style="border-top: 1px solid #AEB6BF; width: 85%; margin: 0 auto 4px auto;"></div>
              <div style="font-size: 9.5px; color: #5F6772; font-weight: 600;">Signature of the Customer</div>
            </div>

            <!-- Right Block: Bank Details & Digital Payment Options -->
            <div class="info-card" style="display: flex; flex-direction: column; min-height: 145px; padding: 12px 10px;">
              <div class="info-card-header" style="border-bottom: 1px solid #AEB6BF; padding-bottom: 4px; margin-bottom: 6px;">BANK DETAILS:</div>
              <div class="info-card-body" style="font-size: 11px; line-height: 1.4; color: #0F172A;">
                <p style="margin: 0 0 2px 0;"><strong>Beneficiary Name:</strong> SHREE RAM PACKERS AND MOVERS</p>
                <p style="margin: 0 0 2px 0;"><strong>Bank Name:</strong> State Bank of India</p>
                <p style="margin: 0 0 2px 0;"><strong>A/C No.:</strong> 39576624786</p>
                <p style="margin: 0 0 5px 0;"><strong>IFSC Code:</strong> SBIN0007932</p>
                
                <div style="border-top: 1px dashed #AEB6BF; padding-top: 4px; margin-top: 4px;">
                  <span style="font-size: 9px; font-weight: 700; color: #5F6772; text-transform: uppercase; display: block; margin-bottom: 3px;">Other Payment Options:</span>
                  <div style="font-size: 11px; line-height: 1.4;">
                    <div><strong>GooglePay:</strong> 8839411883</div>
                    <div style="margin-top: 2px;"><strong>PhonePe:</strong> 8839411883</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Professional Footer Support Strip -->
        <div class="document-footer-strip" style="border-top: 1.5px solid #AEB6BF; padding-top: 6px; margin-top: 15px; text-align: center; font-size: 11px; color: #5F6772; font-weight: 500;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 2px;">
            <svg viewBox="0 0 24 24" width="11" height="11" stroke="#B30000" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; flex-shrink: 0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span style="font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">For Booking, Assistance & Support</span>
          </div>
          <div style="font-size: 11px; font-weight: 600; color: #5F6772;">
            <span style="color: #B30000; font-weight: 700;">8839411883</span>
            <span style="color: #AEB6BF; margin: 0 4px;">|</span>
            <span style="color: #B30000; font-weight: 700;">8815116069</span>
            <span style="color: #AEB6BF; margin: 0 4px;">|</span>
            <a href="http://www.srlmovers.in" target="_blank" style="color: #0F172A; text-decoration: none; font-weight: 700;">www.srlmovers.in</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const renderQuotation = (data) => {
  const amount = Number(data.amount || 0);
  const basicAmount = Math.round((amount / 1.05) * 100) / 100; // 5% GST option for estimate
  const gstAmount = Math.round((amount - basicAmount) * 100) / 100;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Quotation - SRL Group</title>
      ${getCommonStyles()}
    </head>
    <body>
      <div class="a4-container">
        <div class="content-area">
          ${getHeaderHTML('Quotation', data.invoiceNumber ? 'Q-' + data.invoiceNumber.split('/').pop() : 'Q-4098', data.createdAt || new Date(), 'Quote No')}
          
          <div class="section-grid">
            <div class="info-card">
              <div class="info-card-header">Quotation Prepared For</div>
              <div class="info-card-body">
                <p><strong>Name:</strong> ${data.customerName}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Pickup Address:</strong> ${data.pickupAddress}</p>
                <p><strong>Pickup City:</strong> ${data.pickupCity}</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card-header">Relocation Details</div>
              <div class="info-card-body">
                <p><strong>Delivery Destination:</strong> ${data.deliveryAddress}</p>
                <p><strong>Delivery City:</strong> ${data.deliveryCity}</p>
                <p><strong>Delivery Type:</strong> ${data.deliveryType}</p>
                <p><strong>Moving Mode:</strong> Road Transport (Dedicated Vehicle)</p>
              </div>
            </div>
          </div>

          <table class="item-table">
            <thead>
              <tr>
                <th style="width: 50px;">S.No.</th>
                <th>Service Description</th>
                <th>Material & Details</th>
                <th class="amount-col">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td><strong>Packing & Material Cost</strong><br/>High-quality bubble wrap, corrugated sheets, tapes, cartons</td>
                <td>Premium Packing</td>
                <td class="amount-col">₹${(basicAmount * 0.2).toFixed(2)}</td>
              </tr>
              <tr>
                <td>2</td>
                <td><strong>Loading Charges</strong><br/>Professional loading by experienced staff</td>
                <td>Standard Loading</td>
                <td class="amount-col">₹${(basicAmount * 0.1).toFixed(2)}</td>
              </tr>
              <tr>
                <td>3</td>
                <td><strong>Transportation Charges</strong><br/>Safe transport via container truck (${data.truckNumber || 'Suitable Vehicle'})</td>
                <td>${data.pickupCity} to ${data.deliveryCity}</td>
                <td class="amount-col">₹${(basicAmount * 0.6).toFixed(2)}</td>
              </tr>
              <tr>
                <td>4</td>
                <td><strong>Unloading & Unpacking Charges</strong><br/>Unloading and setting up items at target destination</td>
                <td>Standard Delivery</td>
                <td class="amount-col">₹${(basicAmount * 0.1).toFixed(2)}</td>
              </tr>
              <tr>
                <td></td>
                <td colspan="2" style="text-align: right;"><strong>Sub Total</strong></td>
                <td class="amount-col">₹${basicAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td></td>
                <td colspan="2" style="text-align: right;"><strong>GST @ 5% (Trans. Rate)</strong></td>
                <td class="amount-col">₹${gstAmount.toFixed(2)}</td>
              </tr>
              <tr class="totals-row grand-total">
                <td></td>
                <td colspan="2" style="text-align: right;">ESTIMATED TOTAL (Net Cost)</td>
                <td class="amount-col">₹${amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="amount-words-section">
            <strong>Estimated Amount in Words:</strong> ${data.amountInWords || 'Rupees Only'}
          </div>

          <div class="footer-grid">
            <div class="terms-section">
              <h3>Terms & Conditions of Service:</h3>
              <ol>
                <li>Quotation valid for 15 days from the date of issue.</li>
                <li>Transit Insurance is highly recommended at 1.5% extra of declared value.</li>
                <li>Octroi, toll tax, and other state entry taxes will be charged on actual receipt basis.</li>
                <li>Packing will be done under customer supervision.</li>
              </ol>
            </div>
            <div class="bank-section">
              <h3>Why Choose SRL Group?</h3>
              <p>✔ 10+ Years of Professional Experience</p>
              <p>✔ Dedicated Container Trucks (Weather-proof)</p>
              <p>✔ 24/7 Shipment Location Updates</p>
              <p>✔ Trained & Verified Relocation Crews</p>
              <p>✔ Zero Damage Guarantee with Insurance</p>
            </div>
          </div>
        </div>

        <div class="footer-block">
          <div class="signature-panel">
            <div class="signature-box">
              <div class="signature-line">Customer Approval</div>
            </div>
            <div class="signature-box company-sig">
              <p style="font-size: 8px; color: #5F6772; margin-bottom: 30px;">For SRL Group</p>
              <div class="signature-line" style="margin-top: 10px;">Marketing Manager</div>
            </div>
          </div>
          <div style="margin-top: 15px;" class="page-footer">
            <span>Corporate Quotation System</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
        <!-- Professional Footer Support Strip -->
        <div class="document-footer-strip" style="border-top: 1.5px solid #AEB6BF; padding-top: 6px; margin-top: 10px; text-align: center; font-size: 10px; color: #5F6772; font-weight: 500;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 2px;">
            <svg viewBox="0 0 24 24" width="11" height="11" stroke="#B30000" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; flex-shrink: 0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span style="font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">For Booking, Assistance & Support</span>
          </div>
          <div style="font-size: 10px; font-weight: 600; color: #5F6772;">
            <span style="color: #B30000; font-weight: 700;">8839411883</span>
            <span style="color: #AEB6BF; margin: 0 4px;">|</span>
            <span style="color: #B30000; font-weight: 700;">8815116069</span>
            <span style="color: #AEB6BF; margin: 0 4px;">|</span>
            <a href="http://www.srlmovers.in" target="_blank" style="color: #0F172A; text-decoration: none; font-weight: 700;">www.srlmovers.in</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const renderLR = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Lorry Receipt - ${data.lrNumber || 'Draft'}</title>
      ${getCommonStyles()}
      <style>
        /* Specific overrides for Lorry Receipt template */
        .doc-title-badge {
          font-size: 15px !important;
          padding: 5px 10px !important;
          max-width: 170px !important;
          margin-bottom: 4px !important;
        }
        .meta-table {
          max-width: 170px !important;
        }
        .a4-container {
          padding-bottom: 6mm !important;
        }
        .lr-footer-wrapper {
          margin-top: auto !important;
        }
        .document-footer-strip {
          margin-top: 6px !important;
        }
        /* Increase body content text size in LR to 11px minimum */
        .info-card-body p, 
        .info-card-body span, 
        .info-card-body div, 
        .info-card-body strong,
        .lr-header-block p, 
        .lr-header-block div, 
        .lr-header-block span, 
        .lr-header-block strong,
        .lr-ops-card p, 
        .lr-ops-card div, 
        .lr-ops-card span, 
        .lr-ops-card strong,
        .particulars-table td, 
        .particulars-table th, 
        .particulars-table span,
        .particulars-table strong,
        .document-footer-strip div,
        .document-footer-strip span,
        .info-card div,
        .info-card span,
        .info-card p,
        .info-card strong {
          font-size: 11px !important;
        }
        /* Heading sizes inside info-cards */
        .info-card-header {
          font-size: 12px !important;
        }
      </style>
    </head>
    <body>
      <div class="a4-container">
        <div class="content-area">
           ${getHeaderHTML('Lorry Receipt', data.lrNumber || '3426', data.createdAt || new Date(), 'LR Number')}
          
          <!-- Horizontal Notice & Info Card -->
          <div class="lr-header-block">
            <!-- Left Column: Notice -->
            <div class="lr-header-notice">
              <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: #B30000; margin-right: 3px; flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span style="font-size: 12px; font-weight: 700; color: #B30000; letter-spacing: 0.5px; text-transform: uppercase;">NOTICE</span>
              </div>
              <p style="font-size: 11px; color: #5F6772; line-height: 1.35; margin: 0; padding: 0;">The consignment by the lorry receipt shall be stored at the destination under the control of the transport operator and shall be delivered to the order of the consignee whose name is mentioned in the lorry receipt. It will under no circumstances be delivered to anyone without written authority from the consignee on its order.</p>
            </div>
 
            <!-- Center Column: At Owner's Risk -->
            <div class="lr-header-risk">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: #B30000; margin-bottom: 3px; flex-shrink: 0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span style="font-size: 10.5px; font-weight: 800; color: #0F172A; line-height: 1.1; text-transform: uppercase; letter-spacing: 0.5px;">AT<br/>OWNER'S<br/>RISK</span>
            </div>
 
            <!-- Right Column: Shipment Information Rows -->
            <div class="lr-header-info">
              <div><span style="color: #5F6772;">LR No. :</span> <strong style="color: #B30000;">${data.lrNumber || 'N/A'}</strong></div>
              <div style="margin-top: 1px;"><span style="color: #5F6772;">LR Date :</span> <strong style="color: #B30000;">${data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}</strong></div>
              <div style="margin-top: 1px;"><span style="color: #5F6772;">Move From :</span> <strong style="color: #B30000;">${data.pickupCity || 'N/A'}</strong></div>
              <div style="margin-top: 1px;"><span style="color: #5F6772;">Move To :</span> <strong style="color: #B30000;">${data.deliveryCity || 'N/A'}</strong></div>
              <div style="margin-top: 1px;"><span style="color: #5F6772;">Vehicle No. :</span> <strong style="color: #B30000;">${data.truckNumber || 'N/A'}</strong></div>
            </div>
          </div>
 
          <div class="lr-meta-grid">
            <!-- Left Card: PICKUP DETAILS -->
            <div class="lr-meta-card" style="padding: 10px; background-color: #FFFFFF;">
              <div style="font-size: 12px; font-weight: 700; color: #B30000; border-bottom: 1px solid #AEB6BF; padding-bottom: 4px; margin-bottom: 6px; text-transform: uppercase;">PICKUP DETAILS</div>
              <div style="font-size: 11px; line-height: 1.4; color: #0F172A;">
                <p style="margin: 0 0 2px 0;"><span style="color: #5F6772; font-weight: 500;">Name:</span> <strong style="color: #0F172A; font-weight: 600;">${data.customerName}</strong></p>
                <p style="margin: 0 0 2px 0;"><span style="color: #5F6772; font-weight: 500;">Phone:</span> <strong style="color: #0F172A; font-weight: 600;">${data.phone}</strong></p>
                <p style="margin: 0 0 2px 0;"><span style="color: #5F6772; font-weight: 500;">Address:</span> <strong style="color: #0F172A; font-weight: 600;">${data.pickupAddress}</strong></p>
                <p style="margin: 0;"><span style="color: #5F6772; font-weight: 500;">City/State/Pincode:</span> <strong style="color: #0F172A; font-weight: 600;">${data.pickupCity}</strong></p>
              </div>
            </div>
 
            <!-- Right Card: DELIVERY DETAILS -->
            <div class="lr-meta-card" style="padding: 10px; background-color: #FFFFFF;">
              <div style="font-size: 12px; font-weight: 700; color: #B30000; border-bottom: 1px solid #AEB6BF; padding-bottom: 4px; margin-bottom: 6px; text-transform: uppercase;">DELIVERY DETAILS</div>
              <div style="font-size: 11px; line-height: 1.4; color: #0F172A;">
                <p style="margin: 0 0 2px 0;"><span style="color: #5F6772; font-weight: 500;">Name:</span> <strong style="color: #0F172A; font-weight: 600;">${data.customerName}</strong></p>
                <p style="margin: 0 0 2px 0;"><span style="color: #5F6772; font-weight: 500;">Phone:</span> <strong style="color: #0F172A; font-weight: 600;">${data.phone}</strong></p>
                <p style="margin: 0 0 2px 0;"><span style="color: #5F6772; font-weight: 500;">Address:</span> <strong style="color: #0F172A; font-weight: 600;">${data.deliveryAddress}</strong></p>
                <p style="margin: 0;"><span style="color: #5F6772; font-weight: 500;">City/State/Pincode:</span> <strong style="color: #0F172A; font-weight: 600;">${data.deliveryCity}</strong></p>
              </div>
            </div>
          </div>

          <div class="lr-ops-bar" style="display: flex; gap: 12px; margin-bottom: 8px; margin-top: 8px;">
            <div class="lr-ops-card" style="flex: 1; display: flex; align-items: center; background-color: #FFFFFF; border: 1px solid #AEB6BF; border-radius: 0; padding: 5px 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#1B365D" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; flex-shrink: 0;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <div>
                <div style="font-size: 10px; font-weight: 700; color: #1B365D; text-transform: uppercase; letter-spacing: 0.5px;">PACKAGE</div>
                <div style="font-size: 11px; font-weight: 700; color: #0F172A; margin-top: 1px;">N/A</div>
              </div>
            </div>
            <div class="lr-ops-card" style="flex: 1; display: flex; align-items: center; background-color: #FFFFFF; border: 1px solid #AEB6BF; border-radius: 0; padding: 5px 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#1B365D" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; flex-shrink: 0;"><path d="M12 22V8M5 12h14"></path></svg>
              <div>
                <div style="font-size: 10px; font-weight: 700; color: #1B365D; text-transform: uppercase; letter-spacing: 0.5px;">TOTAL WEIGHT</div>
                <div style="font-size: 11px; font-weight: 700; color: #0F172A; margin-top: 1px;">Full Truck Load</div>
              </div>
            </div>
            <div class="lr-ops-card" style="flex: 1; display: flex; align-items: center; background-color: #FFFFFF; border: 1px solid #AEB6BF; border-radius: 0; padding: 5px 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#1B365D" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <div>
                <div style="font-size: 10px; font-weight: 700; color: #1B365D; text-transform: uppercase; letter-spacing: 0.5px;">PACKAGE CONDITION</div>
                <div style="font-size: 11px; font-weight: 700; color: #0F172A; margin-top: 1px;">Apparent Good Condition</div>
              </div>
            </div>
          </div>
 
          <!-- BLOCK 2: FREIGHT / GOODS DETAILS -->
          <div class="info-card" style="display: grid; grid-template-columns: 1.2fr 1.8fr; gap: 10px; padding: 8px; margin-bottom: 8px; background-color: #FFFFFF;">
            <!-- Left Column: Description & Remark -->
            <div style="border-right: 1px solid #AEB6BF; padding-right: 12px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 12px; font-weight: 700; color: #1B365D; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">PACKAGE AND GOODS DESCRIPTION</div>
                <div style="font-size: 11px; font-weight: 600; color: #0F172A; line-height: 1.3;">Old And Used Household Goods</div>
              </div>
              <div style="margin-top: 6px; border-top: 1px dashed #AEB6BF; padding-top: 4px;">
                <span style="font-size: 11px; font-weight: 700; color: #5F6772; text-transform: uppercase;">Remark:</span>
                <span style="font-size: 11px; font-weight: 600; color: #0F172A; margin-left: 4px;">Door Delivery</span>
              </div>
            </div>
 
            <!-- Right Column: Freight Details -->
            <div style="display: flex; flex-direction: column; justify-content: space-between;">
              <div style="display: flex; justify-content: space-between; gap: 8px;">
                <div style="flex: 1; text-align: center; background-color: #F0F7FF; border: 1px solid #D0E7FF; border-radius: 0; padding: 5px 3px;">
                  <div style="font-size: 10px; font-weight: 700; color: #1B365D; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px;">Freight Paid</div>
                  <div style="font-size: 19px; font-weight: 800; color: #B30000;">₹${Number(data.amount || 0).toLocaleString('en-IN') || '95,000'}</div>
                </div>
                <div style="flex: 1; text-align: center; background-color: #F0F7FF; border: 1px solid #D0E7FF; border-radius: 0; padding: 5px 3px;">
                  <div style="font-size: 10px; font-weight: 700; color: #1B365D; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px;">Freight To Pay</div>
                  <div style="font-size: 19px; font-weight: 800; color: #B30000;">₹0.00</div>
                </div>
                <div style="flex: 1; text-align: center; background-color: #F0F7FF; border: 1px solid #D0E7FF; border-radius: 0; padding: 5px 3px;">
                  <div style="font-size: 10px; font-weight: 700; color: #1B365D; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px;">Freight To Be Billed</div>
                  <div style="font-size: 19px; font-weight: 800; color: #B30000;">₹0.00</div>
                </div>
              </div>
              <div style="margin-top: 6px; border-top: 1px dashed #AEB6BF; padding-top: 4px;">
                <div style="font-size: 10.5px; font-weight: 700; color: #5F6772; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">RUPEES IN WORDS</div>
                <div style="font-size: 11px; font-weight: 700; color: #1B365D;">${data.amountInWords || 'Ninety-Five Thousand Rupees Only'}</div>
              </div>
            </div>
          </div>
 
          <!-- BLOCK 3: DEMURRAGE SECTION -->
          <div class="info-card" style="padding: 6px 8px; margin-bottom: 8px; background-color: #F0F7FF; border: 1px solid #D0E7FF;">
            <div style="font-size: 12px; font-weight: 700; color: #1B365D; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Schedule of demurrage charge: -</div>
            <p style="font-size: 11px; color: #1E3A8A; line-height: 1.35; margin: 0; padding: 0;">Demurrage charge after more than 5 day@500 Rupees Per Hour + Handling charges & local transportation charges.</p>
          </div>
 
          <!-- BLOCK 4: INSURANCE SECTION -->
          <div class="info-card" style="padding: 8px; margin-bottom: 8px; background-color: #FFFFFF;">
            <div style="font-size: 12px; font-weight: 700; color: #B30000; border-bottom: 1px solid #AEB6BF; padding-bottom: 4px; margin-bottom: 6px; text-transform: uppercase;">MATERIAL NOT INSURED</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; font-size: 11px; color: #0F172A;">
              <div><span style="color: #5F6772; font-weight: 500;">Insurance Company:</span> <strong style="font-weight: 600;">N/A</strong></div>
              <div><span style="color: #5F6772; font-weight: 500;">Policy Number:</span> <strong style="font-weight: 600;">N/A</strong></div>
              <div><span style="color: #5F6772; font-weight: 500;">Insurance Date:</span> <strong style="font-weight: 600;">N/A</strong></div>
              <div><span style="color: #5F6772; font-weight: 500;">Insured Amount:</span> <strong style="font-weight: 600;">N/A</strong></div>
              <div><span style="color: #5F6772; font-weight: 500;">Insurance Risk:</span> <strong style="font-weight: 600;">N/A</strong></div>
            </div>
          </div>

          <div class="footer-grid" style="grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 12px; display: grid;">
            <!-- Left Block: Company Signatory -->
            <div class="info-card" style="display: flex; flex-direction: column; justify-content: space-between; text-align: center; min-height: 220px; padding: 12px 10px; border-radius: 0; background-color: #FFFFFF; border: 1px solid #AEB6BF;">
              <div class="info-card-header" style="text-align: center; border-bottom: 1px solid #AEB6BF; padding-bottom: 4px; margin-bottom: 6px; font-size: 12px; font-weight: 700;">FOR SHREE RAM PACKERS & MOVERS</div>
              <div style="flex-grow: 1; min-height: 130px;"></div>
              <div style="border-top: 1px solid #AEB6BF; width: 85%; margin: 0 auto 4px auto;"></div>
              <div style="font-size: 9.5px; color: #5F6772; font-weight: 600;">Authorised Signatory</div>
            </div>

            <!-- Right Block: Receiver Signature -->
            <div class="info-card" style="display: flex; flex-direction: column; justify-content: space-between; text-align: center; min-height: 220px; padding: 12px 10px; border-radius: 0; background-color: #FFFFFF; border: 1px solid #AEB6BF;">
              <div class="info-card-header" style="text-align: center; border-bottom: none; padding-bottom: 4px; margin-bottom: 6px; color: #5F6772; font-size: 9px; text-transform: uppercase;">I AGREE TO THE TERMS & CONDITIONS</div>
              <div style="font-weight: 600; color: #5F6772; margin-top: 2px;">SIGNATURE RECEIVER</div>
              <div style="flex-grow: 1; min-height: 130px;"></div>
              <div style="border-top: 1px solid #AEB6BF; width: 85%; margin: 0 auto 4px auto;"></div>
            </div>
          </div>
        </div>
 
        <!-- Bottom Wrapper containing Support Footer -->
        <div class="lr-footer-wrapper" style="margin-top: auto; page-break-inside: avoid; break-inside: avoid;">
          <!-- Professional Footer Support Strip -->
          <div class="document-footer-strip" style="border-top: 1.5px solid #AEB6BF; padding-top: 6px; margin-top: 10px; text-align: center; font-size: 10px; color: #5F6772; font-weight: 500;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 2px;">
              <svg viewBox="0 0 24 24" width="11" height="11" stroke="#B30000" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; flex-shrink: 0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span style="font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">For Booking, Assistance & Support</span>
            </div>
            <div style="font-size: 10px; font-weight: 600; color: #5F6772;">
              <span style="color: #B30000; font-weight: 700;">8839411883</span>
              <span style="color: #AEB6BF; margin: 0 4px;">|</span>
              <span style="color: #B30000; font-weight: 700;">8815116069</span>
              <span style="color: #AEB6BF; margin: 0 4px;">|</span>
              <a href="http://www.srlmovers.in" target="_blank" style="color: #0F172A; text-decoration: none; font-weight: 700;">www.srlmovers.in</a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const renderMoneyReceipt = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Money Receipt - ${data.receiptNumber || 'Draft'}</title>
      ${getCommonStyles()}
    </head>
    <body>
      <div class="a4-container">
        <div class="content-area">
           ${getHeaderHTML('Money Receipt', data.receiptNumber || '2698', data.createdAt || new Date(), 'Receipt No')}
          
          <div class="info-card" style="margin-top: 30px; border-radius: 0; border: none;">
            <div class="info-card-header" style="color: #0F172A; border-bottom: 2px solid #B30000; font-weight: 700; font-size: 12px;">Payment Details</div>
            

            <div style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #AEB6BF; padding: 8px 4px; font-size: 10px;">
              <div><span style="color: #5F6772; font-weight: 600;">Received From</span>: <span style="font-weight: 700; color: #B30000;">${data.customerName || 'N/A'}</span></div>
              <div><span style="color: #5F6772; font-weight: 600;">Phone</span>: <span style="font-weight: 700; color: #0F172A;">${data.phone || 'N/A'}</span></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #AEB6BF; padding: 8px 4px; font-size: 10px;">
              <div><span style="color: #5F6772; font-weight: 600;">Towards</span>: <span style="font-weight: 600; color: #0F172A;">${data.invoiceNumber ? 'Final Payment of Invoice No. ' + data.invoiceNumber : 'N/A'}</span></div>
              <div><span style="color: #5F6772; font-weight: 600;">Dated</span>: <span style="font-weight: 600; color: #0F172A;">${new Date(data.createdAt || new Date()).toLocaleDateString('en-IN')}</span></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #AEB6BF; padding: 8px 4px; font-size: 10px;">
              <div><span style="color: #5F6772; font-weight: 600;">From</span>: <span style="font-weight: 600; color: #0F172A;">${data.pickupCity || 'N/A'}</span></div>
              <div><span style="color: #5F6772; font-weight: 600;">To</span>: <span style="font-weight: 600; color: #0F172A;">${data.deliveryCity || 'N/A'}</span></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #AEB6BF; padding: 8px 4px; font-size: 10px;">
              <div><span style="color: #5F6772; font-weight: 600;">Payment Mode</span>: <span style="font-weight: 700; color: #0F172A;">${data.paymentMode || 'N/A'}</span></div>
              <div><span style="color: #5F6772; font-weight: 600;">Payment Ref.</span>: <span style="font-weight: 700; color: #0F172A;">${data.referenceNumber || data.paymentRef || 'N/A'}</span></div>
            </div>

            <div style="padding: 10px 4px; font-size: 10px;">
              <span style="color: #5F6772; font-weight: 600;">Rupees in Words</span>: <span style="font-weight: 700; font-style: italic; color: #0F172A;">${data.amountInWords || 'Rupees Only'}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 35px;">
            <!-- Amount Section -->
            <div style="background-color: #B30000; color: #FFFFFF; border-radius: 0; padding: 14px 28px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); min-width: 220px;">
              <div style="font-size: 9px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 6px; opacity: 0.9;">Amount Received</div>
              <div style="font-size: 13px; font-weight: 700;">₹ ${(Number(data.amount || 0)).toFixed(2)}</div>
            </div>

            <!-- Signature Section -->
            <div style="text-align: center; width: 260px; margin-bottom: 5px;">
              <p style="font-size: 9px; font-weight: 700; color: #0F172A; margin-bottom: 60px; letter-spacing: 0.5px;">FOR <span style="color: #B30000; font-weight: 800;">SHREE RAM PACKERS & MOVERS</span></p>
              <div style="border-top: 1px solid #AEB6BF; width: 85%; margin: 0 auto 5px auto;"></div>
              <p style="font-size: 8px; color: #5F6772; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Authorized Signatory</p>
            </div>
          </div>
        </div>

        <div class="footer-block" style="margin-top: auto;">
          <div style="margin-top: 15px; border-top: 1px solid #AEB6BF; padding-top: 8px;" class="page-footer">
            <span>Official Payment Acknowledgment</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
        <!-- Professional Footer Support Strip -->
        <div class="document-footer-strip" style="border-top: 1.5px solid #AEB6BF; padding-top: 6px; margin-top: 10px; text-align: center; font-size: 10px; color: #5F6772; font-weight: 500;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 2px;">
            <svg viewBox="0 0 24 24" width="11" height="11" stroke="#B30000" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; flex-shrink: 0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span style="font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">For Booking, Assistance & Support</span>
          </div>
          <div style="font-size: 10px; font-weight: 600; color: #5F6772;">
            <span style="color: #B30000; font-weight: 700;">8839411883</span>
            <span style="color: #AEB6BF; margin: 0 4px;">|</span>
            <span style="color: #B30000; font-weight: 700;">8815116069</span>
            <span style="color: #AEB6BF; margin: 0 4px;">|</span>
            <a href="http://www.srlmovers.in" target="_blank" style="color: #0F172A; text-decoration: none; font-weight: 700;">www.srlmovers.in</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  renderTaxInvoice,
  renderQuotation,
  renderLR,
  renderMoneyReceipt
};
