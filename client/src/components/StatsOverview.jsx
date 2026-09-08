import React from 'react';
import { Package2, AlertTriangle, Layers2, IndianRupee, ChevronRight, Calendar, CheckSquare, MessageSquare } from 'lucide-react';

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
      subtext: 'Active catalog items',
      themeClass: 'card-blue',
      icon: <Package2 size={26} />,
      linkText: 'View Inventory'
    },
    {
      key: 'value',
      label: 'Inventory Value',
      value: `₹${totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: 'Cumulative valuation',
      themeClass: 'card-orange',
      icon: <IndianRupee size={26} />,
      linkText: 'View Valuation'
    },
    {
      key: 'units',
      label: 'Units in Stock',
      value: totalUnits.toLocaleString('en-IN'),
      subtext: 'Total stock across catalog',
      themeClass: 'card-green',
      icon: <Layers2 size={26} />,
      linkText: 'Stock Status'
    },
    {
      key: 'lowstock',
      label: 'Low Stock Alerts',
      value: lowStockCount,
      subtext: isLowStockActive ? 'Filtered view active' : 'Items need restocking',
      themeClass: 'card-red',
      icon: <AlertTriangle size={26} />,
      clickable: true,
      alert: lowStockCount > 0,
      linkText: isLowStockActive ? 'Show All Products' : 'View Restock List'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`stat-card ${card.themeClass}${card.clickable ? ' clickable' : ''}${card.clickable && isLowStockActive ? ' active-stat-card' : ''}`}
          onClick={card.clickable ? onFilterLowStock : undefined}
          id={`stat-card-${card.key}`}
        >
          {/* Top row: content (label + value) on left, icon on right (matching reference UI) */}
          <div className="stat-card-top">
            <div className="stat-content">
              <span className="stat-label">{card.label}</span>
              <span className="stat-value">{card.value}</span>
            </div>

            <div className="stat-icon-wrapper">
              {card.icon}
            </div>
          </div>

          {/* Bottom link bar (matching reference card footer "View Report >") */}
          <div className="stat-card-bottom-link">
            <span>{card.linkText}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {card.alert && (
                <span className="stat-alert-pill">Alert</span>
              )}
              <ChevronRight size={15} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
