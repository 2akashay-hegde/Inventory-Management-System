import React from 'react';
import { Edit2, Trash2, AlertTriangle, CheckCircle2, Minus, Plus, Inbox, TrendingDown, FilterX } from 'lucide-react';

export default function ProductTable({ products, onEdit, onDelete, onQuickAdjustQuantity, loading, activeFilters, onClearFilters }) {
  if (loading) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="spinner" />
          <p style={{ color: 'var(--text-4)', marginTop: 8 }}>Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    const hasFilters = activeFilters && (activeFilters.category !== 'All' || activeFilters.lowStock || activeFilters.search);
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-icon-wrap">
            {hasFilters ? <FilterX size={32} /> : <Inbox size={32} />}
          </div>
          <p className="empty-title">
            {hasFilters ? 'No Matching Products' : 'No Products Found'}
          </p>
          {hasFilters ? (
            <>
              <p className="empty-desc">
                Active filters:
                {activeFilters.lowStock && <strong style={{ color: '#F87171' }}> Low Stock</strong>}
                {activeFilters.category !== 'All' && <strong style={{ color: 'var(--purple-200)' }}> {activeFilters.category}</strong>}
                {activeFilters.search && <strong style={{ color: 'var(--gold-400)' }}> "{activeFilters.search}"</strong>}
                {' '}are hiding all results.
              </p>
              <button
                className="btn btn-secondary"
                onClick={onClearFilters}
                style={{ marginTop: 8, gap: 8 }}
              >
                <FilterX size={15} />
                Clear All Filters
              </button>
            </>
          ) : (
            <p className="empty-desc">
              Add your first product using the "+ Add Product" button above.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header-bar">
        <div className="table-title">
          <span>Inventory Catalog</span>
          <span className="count-pill">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        {products.some(p => p.quantity <= p.minStock) && (
          <div className="table-restock-badge">
            <TrendingDown size={14} />
            <span>{products.filter(p => p.quantity <= p.minStock).length} item(s) need restocking</span>
          </div>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Unique ID</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Min Stock</th>
              <th>Added On</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isLowStock = product.quantity <= product.minStock;
              const formattedDate = product.createdAt
                ? new Date(product.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })
                : '—';
              const productId = product.id || product._id;
              const uniqueCode = product.uniqueId || product.productCode || (productId ? `PRD-${productId.slice(-6).toUpperCase()}` : 'N/A');

              return (
                <tr
                  key={productId}
                  className={isLowStock ? 'row-low-stock' : ''}
                  id={`product-row-${productId}`}
                >
                  {/* Product Name */}
                  <td>
                    <div className="product-name-main">{product.name}</div>
                  </td>

                  {/* Unique ID */}
                  <td>
                    <span className="product-id-badge font-mono" title={`Full MongoDB ID: ${productId}`}>
                      {uniqueCode}
                    </span>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>

                  {/* Price */}
                  <td>
                    <span className="price-display">
                      ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* Stock Status Badge */}
                  <td>
                    {isLowStock ? (
                      <span
                        className="stock-badge low"
                        title={`Stock (${product.quantity}) is at or below minimum threshold (${product.minStock})`}
                      >
                        <AlertTriangle size={12} />
                        Low Stock
                      </span>
                    ) : (
                      <span className="stock-badge ok">
                        <CheckCircle2 size={12} />
                        Optimal
                      </span>
                    )}
                  </td>

                  {/* Quantity with Quick Stepper */}
                  <td>
                    <div className="stock-stepper">
                      <button
                        className="step-btn"
                        onClick={() => onQuickAdjustQuantity(product, -1)}
                        disabled={product.quantity <= 0}
                        title="Remove 1 unit"
                      >
                        <Minus size={11} strokeWidth={3} />
                      </button>
                      <span className={`qty-value${isLowStock ? ' low-qty' : ''}`}>
                        {product.quantity}
                      </span>
                      <button
                        className="step-btn"
                        onClick={() => onQuickAdjustQuantity(product, 1)}
                        title="Add 1 unit"
                      >
                        <Plus size={11} strokeWidth={3} />
                      </button>
                    </div>
                  </td>

                  {/* Min Stock Threshold */}
                  <td>
                    <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>
                      {product.minStock} units
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-4)' }}>
                      {formattedDate}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td>
                    <div className="action-buttons-cell">
                      <button
                        className="btn-icon edit"
                        onClick={() => onEdit(product)}
                        title="Edit product"
                        id={`btn-edit-${productId}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => onDelete(product)}
                        title="Delete product"
                        id={`btn-delete-${productId}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
