import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'Accessories',
  'Office Supplies',
  'Packaging',
  'Hardware',
  'Software',
  'Furniture',
  'Other'
];

export default function ProductModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    name: '', category: 'Electronics', price: '', quantity: '', minStock: '5'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Electronics',
        price: initialData.price !== undefined ? initialData.price : '',
        quantity: initialData.quantity !== undefined ? initialData.quantity : '',
        minStock: initialData.minStock !== undefined ? initialData.minStock : '5'
      });
    } else {
      setFormData({ name: '', category: 'Electronics', price: '', quantity: '', minStock: '5' });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Product name is required';
    else if (formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!formData.category.trim()) e.category = 'Category is required';
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0)
      e.price = 'Enter a valid price (≥ 0)';
    if (formData.quantity === '' || isNaN(formData.quantity) || Number(formData.quantity) < 0)
      e.quantity = 'Enter a valid quantity (≥ 0)';
    if (formData.minStock === '' || isNaN(formData.minStock) || Number(formData.minStock) < 0)
      e.minStock = 'Enter a valid minimum stock (≥ 0)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      minStock: parseInt(formData.minStock, 10)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const isEdit = !!initialData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-inner">
            <h2 className="modal-title">
              {isEdit ? '✏️  Update Product' : '+ Add New Product'}
            </h2>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="product-name">Product Name</label>
              <input
                id="product-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Wireless Bluetooth Headset"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
              {errors.name && <div className="form-error">⚠ {errors.name}</div>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="product-category">Category</label>
              <select
                id="product-category"
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <div className="form-error">⚠ {errors.category}</div>}
            </div>

            {/* Price + Quantity */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="product-price">Unit Price (₹)</label>
                <input
                  id="product-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && <div className="form-error">⚠ {errors.price}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="product-quantity">Current Stock (Units)</label>
                <input
                  id="product-quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                {errors.quantity && <div className="form-error">⚠ {errors.quantity}</div>}
              </div>
            </div>

            {/* Min Stock */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="product-minStock">Minimum Stock Threshold (minStock)</label>
              <input
                id="product-minStock"
                name="minStock"
                type="number"
                min="0"
                className="form-input"
                placeholder="5"
                value={formData.minStock}
                onChange={handleChange}
              />
              <p className="form-hint">
                System highlights this product as "Low Stock" when inventory reaches or falls below this level.
              </p>
              {errors.minStock && <div className="form-error">⚠ {errors.minStock}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} id="btn-submit-product">
              {isSubmitting
                ? (isEdit ? 'Saving Changes...' : 'Adding Product...')
                : (isEdit ? 'Save Changes' : 'Add to Catalog')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
