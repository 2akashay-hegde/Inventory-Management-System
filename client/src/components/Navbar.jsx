import React from 'react';
import { Package, Plus, RefreshCw, Zap } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onRefresh, loading }) {
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="navbar">
      <div className="brand-section">
        <div className="brand-icon">
          <Package size={22} strokeWidth={2.5} />
        </div>
        <div className="brand-text-group">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 className="brand-title">InventoryHub</h1>
            <span className="brand-badge">Pro</span>
          </div>
          <p className="brand-subtitle">Smart Inventory Management Platform</p>
        </div>
      </div>

      <div className="nav-actions">
        <span className="nav-time">{dateStr} &nbsp;·&nbsp; {now}</span>

        <button
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={loading}
          title="Sync with database"
          id="btn-refresh"
        >
          <RefreshCw size={15} style={loading ? { animation: 'spin 0.7s linear infinite' } : {}} />
          <span>Sync</span>
        </button>

        <button
          className="btn btn-primary"
          onClick={onOpenAddModal}
          id="btn-add-product"
        >
          <Plus size={17} strokeWidth={2.5} />
          <span>Add Product</span>
        </button>
      </div>
    </header>
  );
}
