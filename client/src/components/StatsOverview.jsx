import React from 'react';
import { Package2, AlertTriangle, Layers2, IndianRupee } from 'lucide-react';

export default function StatsOverview({ stats, onFilterLowStock, isLowStockActive }) {
  const {
    totalProducts = 0,
    lowStockCount = 0,
    totalInventoryValue = 0,
    totalUnits = 0
  } = stats || {};

  const cards = [
    {
      key: 'products',
      label: 'Total Products',
      value: totalProducts,
      subtext: 'Items in active catalog',
      icon: <Package2 size={24} />,
      iconClass: 'purple',
      cornerColor: 'rgba(124, 58, 237, 0.6)'
    },
    {
      key: 'lowstock',
      label: 'Low Stock Alerts',
      value: lowStockCount,
      subtext: isLowStockActive ? 'Filtered view active' : 'Click to filter view',
      icon: <AlertTriangle size={24} />,
      iconClass: lowStockCount > 0 ? 'danger' : 'success',
      cornerColor: lowStockCount > 0 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.4)',
      clickable: true,
      alert: lowStockCount > 0
    },
    {
      key: 'units',
      label: 'Units in Stock',
      value: totalUnits.toLocaleString('en-IN'),
      subtext: 'Total across all products',
      icon: <Layers2 size={24} />,
      iconClass: 'gold',
      cornerColor: 'rgba(245, 158, 11, 0.5)'
    },
    {
      key: 'value',
      label: 'Total Inventory Value',
      value: `₹${totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: 'Cumulative stock valuation',
      icon: <IndianRupee size={24} />,
      iconClass: 'success',
      cornerColor: 'rgba(16, 185, 129, 0.5)'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`stat-card${card.clickable ? ' clickable' : ''}${card.clickable && isLowStockActive ? ' active-stat-card' : ''}`}
          onClick={card.clickable ? onFilterLowStock : undefined}
          style={
            card.clickable && isLowStockActive
              ? { borderColor: 'rgba(239, 68, 68, 0.48)', boxShadow: '0 0 22px rgba(239, 68, 68, 0.18)' }
              : {}
          }
          id={`stat-card-${card.key}`}
        >
          {/* Ambient corner glow */}
          <div
            className="corner-glow"
            style={{ background: `radial-gradient(circle, ${card.cornerColor}, transparent)` }}
          />

          {/* Top row: icon + optional alert pill */}
          <div className="stat-card-top">
            <div className={`stat-icon-wrapper ${card.iconClass}`}>
              {card.icon}
            </div>
            {card.alert && (
              <span className="stat-alert-pill">Action Needed</span>
            )}
          </div>

          {/* Bottom: label, value, subtext */}
          <div className="stat-content">
            <span className="stat-label">{card.label}</span>
            <span
              className="stat-value"
              style={{
                color: card.key === 'value'
                  ? 'var(--gold-400)'
                  : card.key === 'lowstock' && lowStockCount > 0
                  ? '#F87171'
                  : undefined
              }}
            >
              {card.value}
            </span>
            <span className="stat-subtext">{card.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
