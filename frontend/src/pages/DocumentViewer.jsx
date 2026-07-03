import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Send, RefreshCw, FileText } from 'lucide-react';
import API from '../services/api';
import '../components/DocumentTemplates.css';

const DocumentHeader = ({ title, docLabel, docNumber, date }) => {
  return (
    <div className="flex justify-between items-start mb-3">
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-[#0F172A] leading-none">SRL GROUP</h1>
        <p className="text-[10px] tracking-widest text-[#B30000] font-semibold uppercase mt-0.5">
          Shree Ram Packers & Movers
        </p>
        <p className="text-[9px] text-slate-500 leading-normal mt-1.5">
          <strong>Regd Office:</strong> Plot No. 16, New T.T. Nagar, Neelbad, Bhopal, Madhya Pradesh – 462044<br/>
          <strong>GST No.:</strong> 23ALKPD0239M1Z9 | <strong>Regd No.:</strong> 49947/BPL/CE/2009<br/>
          <strong>Phone:</strong> 8839411883, 8815116069 | <strong>Email:</strong> contact@srlmovers.in | <strong>Web:</strong> www.srlmovers.in
        </p>
      </div>
      <div className="flex flex-col items-end border-l border-slate-100 pl-4">
        <div className="bg-[#0F172A] text-white px-3 py-1.5 text-xs font-bold tracking-wider uppercase mb-2 min-w-[150px] text-center">
          {title}
        </div>
        <table className="border-collapse text-[9px] w-[150px]">
          <tbody>
            <tr className="border border-slate-200">
              <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-200">
                {docLabel}:
              </td>
              <td className="p-1.5 font-mono">
                {docNumber || 'Draft'}
              </td>
            </tr>
            <tr className="border border-slate-200">
              <td className="p-1.5 bg-slate-50 font-bold border-r border-slate-200">Date:</td>
              <td className="p-1.5">{date}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

function DocumentViewer() {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('invoice'); // invoice, quotation, lr, receipt
  const [downloading, setDownloading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [scale, setScale] = useState(1);
  const containerRef = React.useRef(null);

  useEffect(() => {
    fetchShipment();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const targetWidth = 794; // approx width for 210mm
        const availableWidth = containerWidth - 48; // padding

        // Width-priority scaling: fill available horizontal space first,
        // allow vertical scrolling if the page extends below the viewport.
        const scaleX = availableWidth / targetWidth;
        setScale(Math.max(0.3, Math.min(1.2, scaleX)));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [previewHtml]);

  useEffect(() => {
    if (shipment) {
      fetchPreviewHtml();
    }
  }, [shipment, activeTab]);

  const fetchPreviewHtml = async () => {
    try {
      const response = await API.get(`/shipments/${id}/html/${activeTab}`);
      setPreviewHtml(response.data);
    } catch (err) {
      console.error('Error fetching preview HTML:', err);
    }
  };

  const fetchShipment = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/shipments/${id}`);
      setShipment(response.data);
    } catch (err) {
      console.error('Error fetching shipment:', err);
      setError('Could not retrieve shipment details for document generation.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!shipment) return;
    setDownloading(true);
    try {
      const response = await API.get(`/shipments/${id}/pdf/${activeTab}`, {
        responseType: 'blob'
      });
      
      // Create a local URL for the PDF blob and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      
      const fileNames = {
        invoice: 'TAX_INVOICE',
        quotation: 'QUOTATION',
        lr: 'LORRY_RECEIPT',
        receipt: 'MONEY_RECEIPT'
      };
      
      const docNum = activeTab === 'invoice' ? (shipment.invoiceNumber || shipment._id) :
                     activeTab === 'lr' ? (shipment.lrNumber || shipment._id) :
                     activeTab === 'receipt' ? (shipment.receiptNumber || shipment._id) : 
                     (shipment.invoiceNumber ? 'Q-' + shipment.invoiceNumber.split('/').pop() : shipment._id);

      link.download = `SRL_${fileNames[activeTab]}_${docNum}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Failed to generate and download PDF. Please check server logs.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } else {
      window.print();
    }
  };

  const handleSendWhatsApp = () => {
    if (!shipment) return;
    
    const docNames = {
      invoice: 'Tax Invoice',
      quotation: 'Quotation Estimate',
      lr: 'Lorry Receipt (LR)',
      receipt: 'Money Receipt'
    };

    const docNum = activeTab === 'invoice' ? shipment.invoiceNumber :
                   activeTab === 'lr' ? shipment.lrNumber :
                   activeTab === 'receipt' ? shipment.receiptNumber : 
                   (shipment.invoiceNumber ? 'Q-' + shipment.invoiceNumber.split('/').pop() : 'Estimate');

    const cleanPhone = shipment.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const text = `Hello *${shipment.customerName}*,\n\nGreetings from *SRL Group (Shree Ram Packers & Movers)*.\n\nWe have prepared your *${docNames[activeTab]}* (Ref No: ${docNum || 'Draft'}) for the relocation from *${shipment.pickupCity}* to *${shipment.deliveryCity}*.\n\n*Shipment Summary:*\n- Truck No: ${shipment.truckNumber}\n- Goods: ${shipment.goodsDescription}\n- Weight/Volume: ${shipment.weight}\n- Net Freight Amount: ₹${Number(shipment.amount).toLocaleString('en-IN')}\n- Payment Mode: ${shipment.paymentMode}\n\nOur team is committed to a safe relocation experience.\n\nRegards,\n*SRL Group Packers & Movers*\nWeb: www.srlmovers.in\nPhone: 8839411883, 8815116069`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodedText}`, '_blank');
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 text-xs">
        <RefreshCw className="animate-spin text-[#B30000] mx-auto mb-4" size={24} />
        <span>Loading templates and records...</span>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-[#B30000] text-xs text-[#B30000] font-semibold">
        {error || 'Consignment record not found.'}
      </div>
    );
  }

  // Formatting variables for React Template preview
  const amount = Number(shipment.amount || 0);
  const formattedDate = new Date(shipment.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Calculations for Invoice
  const invoiceBasic = Math.round((amount / 1.18) * 100) / 100;
  const invoiceGst = Math.round((amount - invoiceBasic) * 100) / 100;
  const invoiceHalfGst = Math.round((invoiceGst / 2) * 100) / 100;

  // Calculations for Quotation
  const quoteBasic = Math.round((amount / 1.05) * 100) / 100;
  const quoteGst = Math.round((amount - quoteBasic) * 100) / 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 screen-only">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-1.5 border border-slate-300 hover:bg-slate-100 transition-colors text-slate-700">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Document Center</h2>
            <p className="text-xs text-slate-500 mt-0.5">Generate logistics paperwork for {shipment.customerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider py-2 px-3 transition-colors"
          >
            <Printer size={14} className="text-slate-700" />
            <span>Print Document</span>
          </button>
          <button
            onClick={handleSendWhatsApp}
            className="flex items-center gap-1.5 border border-emerald-300 hover:bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider py-2 px-3 transition-colors"
          >
            <Send size={14} className="text-emerald-600" />
            <span>WhatsApp Client</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-1.5 bg-[#B30000] hover:bg-[#900000] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider py-2 px-4 transition-colors"
          >
            {downloading ? (
              <>
                <RefreshCw size={14} className="animate-spin text-white" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download size={14} className="text-white" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs and Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Document Tab Selector */}
        <div className="lg:col-span-3 space-y-4 screen-only">
          <div className="bg-white border border-[#E2E8F0] shadow-sm">
            <div className="p-4 border-b border-[#E2E8F0] bg-slate-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Template
              </h3>
            </div>
            <div className="flex flex-col">
              {[
                { id: 'invoice', name: 'Tax Invoice', code: shipment.invoiceNumber },
                { id: 'quotation', name: 'Quotation Estimate', code: shipment.invoiceNumber ? 'Q-' + shipment.invoiceNumber.split('/').pop() : 'Estimate' },
                { id: 'lr', name: 'Lorry Receipt (LR)', code: shipment.lrNumber },
                { id: 'receipt', name: 'Money Receipt', code: shipment.receiptNumber }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3.5 border-b border-slate-100 transition-colors last:border-b-0 ${
                    activeTab === tab.id
                      ? 'bg-slate-50 border-l-4 border-brand-red text-brand-navy font-bold'
                      : 'hover:bg-slate-50/55 text-slate-600'
                  }`}
                >
                  <div className="text-xs uppercase tracking-wide">{tab.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{tab.code || 'Draft'}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">Printing Tip:</h4>
            <p>You can print documents directly using your browser print. In the print options, make sure to enable <strong>"Background graphics"</strong> to show colored headers correctly.</p>
          </div>
        </div>

        {/* Right Side: Document Preview Area */}
        <div className="lg:col-span-9 flex justify-center">
          <div ref={containerRef} className="document-preview-wrapper w-full flex justify-center bg-slate-200 p-6 border border-[#CBD5E1] overflow-y-auto overflow-x-hidden">
            <div style={{ width: `calc(210mm * ${scale})`, height: `calc(297mm * ${scale})`, position: 'relative' }}>
              <div 
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: '210mm',
                  height: '297mm',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                id="printable-document-area" 
                className="a4-preview-box bg-white shadow-md"
              >
                {previewHtml ? (
                  <iframe
                    id="preview-iframe"
                    srcDoc={previewHtml}
                    title="Document Preview"
                    className="w-full h-full border-0 m-0 p-0 overflow-hidden"
                    scrolling="no"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full p-8 text-slate-400">
                    <RefreshCw className="animate-spin mb-2" size={24} />
                    <span>Loading preview...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentViewer;