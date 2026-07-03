import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileSpreadsheet, PlusCircle, LogOut } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ShipmentEntry from './pages/ShipmentEntry';
import DocumentViewer from './pages/DocumentViewer';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('srl_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main Layout wrapping protected pages
const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userString = localStorage.getItem('srl_user');
  const user = userString ? JSON.parse(userString) : { username: 'Admin' };

  const handleLogout = () => {
    localStorage.removeItem('srl_token');
    localStorage.removeItem('srl_user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/shipment/new', name: 'New Shipment', icon: PlusCircle },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col justify-between border-r border-[#1E293B]">
        <div>
          {/* Logo / Brand Header */}
          <div className="p-6 border-b border-[#1E293B]">
            <Link to="/" className="block">
              <h1 className="text-xl font-bold tracking-wider text-white">SRL GROUP</h1>
              <p className="text-[10px] tracking-widest text-[#B30000] font-semibold uppercase mt-0.5">
                Shree Ram Packers & Movers
              </p>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                               (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1E293B] border-l-4 border-[#B30000] text-white font-semibold'
                      : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer / Logout */}
        <div className="p-4 border-t border-[#1E293B]">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="text-xs text-slate-400">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate max-w-[140px]">
                {user.username}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-white bg-transparent border border-slate-700 hover:border-[#B30000] hover:bg-[#B30000]/10 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/shipment/new"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ShipmentEntry />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/shipment/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ShipmentEntry />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/shipment/:id/documents"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DocumentViewer />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
