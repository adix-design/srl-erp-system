import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Sparkles, Save, ArrowLeft, RefreshCw, FileText, Check } from 'lucide-react';
import API from '../services/api';

function ShipmentEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [whatsappText, setWhatsappText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form Fields State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    pickupAddress: '',
    deliveryAddress: '',
    pickupCity: '',
    deliveryCity: '',
    truckNumber: '',
    amount: '',
    amountInWords: '',
    goodsDescription: '',
    weight: '',
    paymentMode: 'Cash',
    lrNumber: '',
    invoiceNumber: '',
    receiptNumber: '',
    deliveryType: 'Door Delivery',
    status: 'Pending'
  });

  // Fetch shipment if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchShipmentDetails();
    }
  }, [id]);

  const fetchShipmentDetails = async () => {
    try {
      const response = await API.get(`/shipments/${id}`);
      const data = response.data;
      setFormData({
        customerName: data.customerName || '',
        phone: data.phone || '',
        pickupAddress: data.pickupAddress || '',
        deliveryAddress: data.deliveryAddress || '',
        pickupCity: data.pickupCity || '',
        deliveryCity: data.deliveryCity || '',
        truckNumber: data.truckNumber || '',
        amount: data.amount || '',
        amountInWords: data.amountInWords || '',
        goodsDescription: data.goodsDescription || '',
        weight: data.weight || '',
        paymentMode: data.paymentMode || 'Cash',
        lrNumber: data.lrNumber || '',
        invoiceNumber: data.invoiceNumber || '',
        receiptNumber: data.receiptNumber || '',
        deliveryType: data.deliveryType || 'Door Delivery',
        status: data.status || 'Pending'
      });
    } catch (err) {
      console.error('Error fetching shipment:', err);
      setMessage({ text: 'Failed to retrieve consignment details.', type: 'error' });
    }
  };

  // Helper to convert numbers to Indian currency text
  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numToWordsLessThanThousand = (n) => {
      let str = '';
      if (n >= 100) {
        str += a[Math.floor(n / 100)] + 'Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
      } else if (n > 0) {
        str += a[n];
      }
      return str;
    };

    const convert = (amountVal) => {
      let n = Math.floor(amountVal);
      if (n === 0) return 'Zero Rupees Only';
      
      let str = '';
      
      // Crores
      if (n >= 10000000) {
        str += numToWordsLessThanThousand(Math.floor(n / 10000000)) + 'Crore ';
        n %= 10000000;
      }
      // Lakhs
      if (n >= 100000) {
        str += numToWordsLessThanThousand(Math.floor(n / 100000)) + 'Lakh ';
        n %= 100000;
      }
      // Thousands
      if (n >= 1000) {
        str += numToWordsLessThanThousand(Math.floor(n / 1000)) + 'Thousand ';
        n %= 1000;
      }
      // Hundreds/Tens
      if (n > 0) {
        str += numToWordsLessThanThousand(n);
      }
      
      return str.trim() + ' Rupees Only';
    };

    return convert(num);
  };

  // Handle manual input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-compute amount in words if amount is changed
      if (name === 'amount') {
        const val = parseFloat(value);
        updated.amountInWords = isNaN(val) ? '' : numberToWords(val);
      }
      return updated;
    });
  };

  // Generate unique doc numbers
  const generateDocNumber = (prefix) => {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    return `SRL/${prefix}/${dateStr}/${rand}`;
  };

  const fillAutoNumbers = () => {
    setFormData(prev => ({
      ...prev,
      lrNumber: prev.lrNumber || generateDocNumber('LR'),
      invoiceNumber: prev.invoiceNumber || generateDocNumber('INV'),
      receiptNumber: prev.receiptNumber || generateDocNumber('REC'),
    }));
  };

  // Call OpenAI API extraction
  const handleAIExtract = async () => {
    if (!whatsappText.trim()) {
      setMessage({ text: 'Please paste a WhatsApp message first.', type: 'error' });
      return;
    }

    setExtracting(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await API.post('/ai/extract', { text: whatsappText });
      const ext = response.data;
      
      setFormData(prev => ({
        ...prev,
        customerName: ext.customerName || prev.customerName,
        phone: ext.phone || prev.phone,
        pickupAddress: ext.pickupAddress || prev.pickupAddress,
        deliveryAddress: ext.deliveryAddress || prev.deliveryAddress,
        pickupCity: ext.pickupCity || prev.pickupCity,
        deliveryCity: ext.deliveryCity || prev.deliveryCity,
        truckNumber: ext.truckNumber || prev.truckNumber,
        amount: ext.amount || prev.amount,
        amountInWords: ext.amountInWords || (ext.amount ? numberToWords(ext.amount) : prev.amountInWords),
        goodsDescription: ext.goodsDescription || prev.goodsDescription,
        weight: ext.weight || prev.weight,
        paymentMode: ext.paymentMode || prev.paymentMode,
        deliveryType: ext.deliveryType || prev.deliveryType,
        lrNumber: ext.lrNumber || prev.lrNumber || generateDocNumber('LR'),
        invoiceNumber: ext.invoiceNumber || prev.invoiceNumber || generateDocNumber('INV'),
        receiptNumber: ext.receiptNumber || prev.receiptNumber || generateDocNumber('REC'),
      }));

      setMessage({ text: 'AI successfully extracted and pre-filled fields.', type: 'success' });
    } catch (err) {
      console.error('Failed to extract WhatsApp details:', err);
      setMessage({ text: 'AI extraction failed. Falling back to manual entry.', type: 'error' });
    } finally {
      setExtracting(false);
    }
  };

  // Submit and save shipment details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    // Validate amounts
    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      setMessage({ text: 'Please enter a valid amount greater than 0.', type: 'error' });
      setSaving(false);
      return;
    }

    try {
      let savedShipment;
      if (isEditMode) {
        const response = await API.put(`/shipments/${id}`, formData);
        savedShipment = response.data;
      } else {
        const response = await API.post('/shipments', formData);
        savedShipment = response.data;
      }

      navigate(`/shipment/${savedShipment._id}/documents`);
    } catch (err) {
      console.error('Submit error:', err);
      setMessage({
        text: err.response?.data?.error || 'Failed to save consignment records.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-1.5 border border-slate-300 hover:bg-slate-100 transition-colors text-slate-700">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
              {isEditMode ? 'Modify Consignment' : 'New Consignment Booking'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter shipment records and generate documents
            </p>
          </div>
        </div>
        <button
          onClick={fillAutoNumbers}
          className="flex items-center gap-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider py-2 px-3 transition-colors"
        >
          <RefreshCw size={12} />
          <span>Auto-fill Document Numbers</span>
        </button>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`p-3 border-l-4 text-xs font-semibold ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-600 text-green-700' 
            : 'bg-red-50 border-[#B30000] text-[#B30000]'
        }`}>
          {message.text}
        </div>
      )}

      {/* Top Section - WhatsApp Extractor */}
      {!isEditMode && (
        <div className="bg-white border border-[#E2E8F0] p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#B30000]" />
              <span>AI WhatsApp Extraction</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Extract values instantly using AI models</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <textarea
              rows={3}
              value={whatsappText}
              onChange={(e) => setWhatsappText(e.target.value)}
              placeholder="Paste WhatsApp text here... (Example: Name: Raj Sharma, Phone: 9876543210, From: Bhopal, To: Mumbai, Amount: 42000)"
              className="flex-1 px-3 py-2 border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#B30000] bg-white resize-none"
            />
            <button
              onClick={handleAIExtract}
              disabled={extracting}
              className="md:w-48 bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 flex flex-col justify-center items-center gap-1 border border-[#0F172A] transition-colors"
            >
              {extracting ? (
                <>
                  <RefreshCw className="animate-spin text-[#B30000]" size={16} />
                  <span className="text-[9px]">Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-[#B30000]" />
                  <span>Parse with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] shadow-sm">
        <div className="p-4 border-b border-[#E2E8F0] bg-slate-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Consignment Booking Sheet
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Customer Data */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#B30000]">
              1. Customer & Contact Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Addresses and Locations */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#B30000]">
              2. Route & Address Log
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Pickup City *
                </label>
                <input
                  type="text"
                  name="pickupCity"
                  required
                  value={formData.pickupCity}
                  onChange={handleChange}
                  placeholder="e.g. Bhopal"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Delivery City *
                </label>
                <input
                  type="text"
                  name="deliveryCity"
                  required
                  value={formData.deliveryCity}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Full Pickup Address *
                </label>
                <textarea
                  name="pickupAddress"
                  required
                  rows={2}
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="Street details, building, sector, origin city..."
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000] resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Full Delivery Address *
                </label>
                <textarea
                  name="deliveryAddress"
                  required
                  rows={2}
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Street details, building, sector, destination city..."
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Material and Transit */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#B30000]">
              3. Shipment & Operational Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Truck Number *
                </label>
                <input
                  type="text"
                  name="truckNumber"
                  required
                  value={formData.truckNumber}
                  onChange={handleChange}
                  placeholder="e.g. MP-04-HE-1234"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000] uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Shipment Weight / Volume *
                </label>
                <input
                  type="text"
                  name="weight"
                  required
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 1500 Kgs / 14 Ft Truck"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Delivery Type *
                </label>
                <select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000]"
                >
                  <option value="Door Delivery">Door Delivery</option>
                  <option value="Office Delivery">Office Delivery</option>
                  <option value="Warehouse Delivery">Warehouse Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Consignment Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000]"
                >
                  <option value="Pending">Pending Booking</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="md:col-span-4">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Goods Description *
                </label>
                <input
                  type="text"
                  name="goodsDescription"
                  required
                  value={formData.goodsDescription}
                  onChange={handleChange}
                  placeholder="e.g. Household goods, furniture, electronics box"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Accounts and Documents */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#B30000]">
              4. Finance Ledger & Document Numbers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Total Amount (Freight Charges) *
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 42000"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000]"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Amount in Words
                </label>
                <input
                  type="text"
                  name="amountInWords"
                  readOnly
                  value={formData.amountInWords}
                  placeholder="Auto-computed after inputting numeric value"
                  className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 text-xs text-slate-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Payment Mode *
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000]"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer (IMPS/NEFT)</option>
                  <option value="Google Pay / GPay">Google Pay (GPay)</option>
                  <option value="To Pay (COD)">To Pay (COD)</option>
                  <option value="Paid in Advance">Paid in Advance</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Lorry Receipt (LR) Number
                </label>
                <input
                  type="text"
                  name="lrNumber"
                  value={formData.lrNumber}
                  onChange={handleChange}
                  placeholder="Auto-generated if left blank"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000] font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Tax Invoice Number
                </label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  placeholder="Auto-generated if left blank"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000] font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-1">
                  Money Receipt Number
                </label>
                <input
                  type="text"
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleChange}
                  placeholder="Auto-generated if left blank"
                  className="w-full px-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000] font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Footer Action panel */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-slate-50/50 flex justify-between items-center">
          <Link
            to="/"
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider py-2 px-5 transition-colors border border-[#0F172A]"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin text-[#B30000]" />
                <span>Saving Consignment...</span>
              </>
            ) : (
              <>
                <Save size={14} className="text-[#B30000]" />
                <span>Save & Generate Documents</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShipmentEntry;
