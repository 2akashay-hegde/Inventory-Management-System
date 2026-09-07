import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, product, isDeleting }) {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div
            className="modal-header-inner"
            style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#F87171'
              }}>
                <Trash2 size={17} />
              </div>
              <h2 className="modal-title" style={{ color: '#FCA5A5' }}>Delete Product</h2>
            </div>
            <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 14 }}>
            Are you sure you want to permanently remove{' '}
            <strong style={{ color: 'var(--text-1)' }}>"{product.name}"</strong> from inventory?
          </p>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.07)',
            borderRadius: 'var(--r-md)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10
          }}>
            <AlertTriangle size={15} style={{ color: '#F87171', flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: '0.8rem', color: '#FCA5A5', lineHeight: 1.5 }}>
              This action is irreversible. The product, its stock data, and associated records will be permanently deleted from the database.
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onConfirm(product.id || product._id)}
            disabled={isDeleting}
            id="btn-confirm-delete"
          >
            <Trash2 size={15} />
            {isDeleting ? 'Deleting...' : 'Yes, Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
