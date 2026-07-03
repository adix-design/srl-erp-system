import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, FileText, ArrowRight, TrendingUp, AlertCircle, CheckCircle2, Truck } from 'lucide-react';
import API from '../services/api';

function Dashboard() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await API.get('/shipments');
      setShipments(response.data);
    } catch (err) {
      console.error('Failed to load shipments:', err);
      setError('Could not retrieve shipment records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalShipments = shipments.length;
  
  const totalRevenue = shipments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  
  const pendingPayments = shipments
    .filter(s => s.status !== 'Delivered')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const pendingPaymentsCount = shipments.filter(s => s.status !== 'Delivered').length;

  // Group status
  const statusCounts = shipments.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, { Pending: 0, Dispatched: 0, Delivered: 0 });

  // Top Routes Calculation
  const routeCounts = shipments.reduce((acc, curr) => {
    const routeKey = `${curr.pickupCity} → ${curr.deliveryCity}`;
    acc[routeKey] = (acc[routeKey] || 0) + 1;
    return acc;
  }, {});

  const topRoutes = Object.entries(routeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Filtered list
  const filteredShipments = shipments.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.customerName.toLowerCase().includes(query) ||
      item.phone.includes(query) ||
      (item.lrNumber && item.lrNumber.toLowerCase().includes(query)) ||
      item.pickupCity.toLowerCase().includes(query) ||
      item.deliveryCity.toLowerCase().includes(query) ||
      (item.truckNumber && item.truckNumber.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Operations Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time logistics analytics and document management</p>
        </div>
        <Link
          to="/shipment/new"
          className="flex items-center gap-2 bg-[#B30000] hover:bg-[#900000] text-white text-xs font-bold uppercase tracking-wider py-2 px-4 transition-colors"
        >
          <PlusCircle size={14} />
          <span>New Shipment Entry</span>
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-[#B30000] text-xs text-[#B30000] font-medium">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Shipments */}
        <div className="bg-white border border-[#E2E8F0] p-6 shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Shipments</p>
            <p className="text-3xl font-extrabold text-[#0F172A]">{loading ? '...' : totalShipments}</p>
            <div className="text-[10px] text-slate-500 font-medium">Recorded bookings in database</div>
          </div>
          <div className="p-2 bg-slate-100 text-slate-700">
            <Truck size={18} />
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white border border-[#E2E8F0] p-6 shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-extrabold text-[#0F172A]">
              {loading ? '...' : `₹${totalRevenue.toLocaleString('en-IN')}`}
            </p>
            <div className="text-[10px] text-[#B30000] font-bold flex items-center gap-0.5">
              <TrendingUp size={10} /> Cumulative freight & service values
            </div>
          </div>
          <div className="p-2 bg-green-50 text-green-700">
            <CheckCircle2 size={18} />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white border border-[#E2E8F0] p-6 shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Payments</p>
            <p className="text-3xl font-extrabold text-[#B30000]">
              {loading ? '...' : `₹${pendingPayments.toLocaleString('en-IN')}`}
            </p>
            <div className="text-[10px] text-slate-500 font-medium">
              Outstanding values ({pendingPaymentsCount} consignments)
            </div>
          </div>
          <div className="p-2 bg-red-50 text-[#B30000]">
            <AlertCircle size={18} />
          </div>
        </div>
      </div>

      {/* Analytics & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Routes Panel */}
        <div className="bg-white border border-[#E2E8F0] p-5 shadow-sm space-y-4 lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-[#E2E8F0] pb-2">
            High-Volume Logistics Routes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="text-xs text-slate-400 py-4">Loading route statistics...</div>
            ) : topRoutes.length > 0 ? (
              topRoutes.map(([route, count]) => {
                const percentage = Math.min(100, Math.max(10, (count / totalShipments) * 100));
                return (
                  <div key={route} className="border border-slate-100 p-3 space-y-2 bg-slate-50/50">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-[#0F172A]">{route}</span>
                      <span className="text-[#B30000]">{count} shipments</span>
                    </div>
                    {/* SVG Progress bar */}
                    <div className="h-1.5 bg-slate-200 w-full overflow-hidden">
                      <div className="bg-[#B30000] h-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 py-4 col-span-2">No shipment routes data available.</div>
            )}
          </div>
        </div>

        {/* Shipment Status Distribution */}
        <div className="bg-white border border-[#E2E8F0] p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-[#E2E8F0] pb-2">
            Delivery Status Distribution
          </h3>
          {loading ? (
            <div className="text-xs text-slate-400 py-4">Loading stats...</div>
          ) : (
            <div className="space-y-3">
              {[
                { name: 'Pending', count: statusCounts.Pending, color: 'bg-amber-500', text: 'text-amber-600' },
                { name: 'Dispatched', count: statusCounts.Dispatched, color: 'bg-blue-600', text: 'text-blue-600' },
                { name: 'Delivered', count: statusCounts.Delivered, color: 'bg-green-600', text: 'text-green-600' }
              ].map(st => {
                const percentage = totalShipments > 0 ? (st.count / totalShipments) * 100 : 0;
                return (
                  <div key={st.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{st.name}</span>
                      <span className="font-semibold">{st.count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 w-full overflow-hidden">
                      <div className={`${st.color} h-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Shipments Data Grid Table */}
      <div className="bg-white border border-[#E2E8F0] shadow-sm">
        {/* Table Header Filter controls */}
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Consignment Ledger
          </h3>
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search by customer, city, truck or LR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#B30000] transition-colors"
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Fetching shipment logs from administrative database...
            </div>
          ) : filteredShipments.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">LR Number</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Truck No</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(shipment.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#0F172A]">
                      {shipment.lrNumber || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-slate-900">{shipment.customerName}</div>
                        <div className="text-[10px] text-slate-400">{shipment.phone}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {shipment.pickupCity} → {shipment.deliveryCity}
                    </td>
                    <td className="py-3.5 px-4 font-mono uppercase text-slate-600">
                      {shipment.truckNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      ₹{(Number(shipment.amount) || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase ${
                        shipment.status === 'Delivered'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : shipment.status === 'Dispatched'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        to={`/shipment/${shipment._id}/edit`}
                        className="text-xs font-semibold text-[#0F172A] hover:underline"
                      >
                        Edit
                      </Link>
                      <span className="text-slate-300">|</span>
                      <Link
                        to={`/shipment/${shipment._id}/documents`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#B30000] hover:underline"
                      >
                        <FileText size={12} />
                        <span>Documents</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              No matching logistics consignments found. Click "New Shipment Entry" to book one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
