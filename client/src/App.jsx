import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, ChevronDown, AlertTriangle } from 'lucide-react';
import { productApi } from './api/productApi';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ToastContainer from './components/Toast';

export default function App() {
  const [products, setProducts] = useState([]);

  // Global categories list (from API — used for dropdown)
  const [allCategories, setAllCategories] = useState([]);

  // Derive stats dynamically from the currently visible (filtered) products
  const displayStats = useMemo(() => {
    const totalProducts       = products.length;
    const totalUnits          = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0);
    const lowStockCount       = products.filter(p => p.quantity <= p.minStock).length;
    return { totalProducts, totalUnits, totalInventoryValue, lowStockCount, categories: allCategories };
  }, [products, allCategories]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch global categories list (for the dropdown filter)
  const fetchStats = useCallback(async () => {
    try {
      const res = await productApi.getStats();
      if (res.success && res.data.categories) {
        setAllCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  // Fetch Products based on search / category / low stock mode
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (showLowStockOnly) {
        // Uses dedicated GET /products/low-stock API endpoint
        const res = await productApi.getLowStockProducts();
        let items = res.data || [];
        // Apply frontend filter if search or category is also picked
        if (searchQuery.trim()) {
          items = items.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
          );
        }
        if (selectedCategory !== 'All') {
          items = items.filter(
            (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
        setProducts(items);
      } else {
        // Uses GET /products with query params
        const res = await productApi.getProducts(searchQuery.trim(), selectedCategory);
        setProducts(res.data || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, showLowStockOnly]);

  // Initial Load & triggers
  useEffect(() => {
    fetchStats(); // load categories for dropdown once
  }, [fetchStats]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add or Update product
  const handleSaveProduct = async (formData) => {
    setSaving(true);
    try {
      if (editingProduct) {
        const id = editingProduct.id || editingProduct._id;
        await productApi.updateProduct(id, formData);
        showToast(`"${formData.name}" updated successfully!`);
      } else {
        await productApi.createProduct(formData);
        showToast(`"${formData.name}" added to catalog!`);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
      fetchStats(); // refresh categories list after add/edit
    } catch (err) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleConfirmDelete = async (id) => {
    setDeleting(true);
    try {
      await productApi.deleteProduct(id);
      showToast('Product removed from inventory');
      setDeletingProduct(null);
      fetchProducts();
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Quick Quantity Stepper (+1 / -1)
  const handleQuickAdjustQuantity = async (product, delta) => {
    const newQty = Math.max(0, product.quantity + delta);
    if (newQty === product.quantity) return;

    try {
      // Optimistic UI update
      setProducts((prev) =>
        prev.map((p) =>
          (p.id === product.id || p._id === product._id) ? { ...p, quantity: newQty } : p
        )
      );

      const id = product.id || product._id;
      await productApi.updateProduct(id, { quantity: newQty });
      fetchStats();
    } catch (err) {
      showToast('Could not update quantity', 'error');
      fetchProducts(); // revert on failure
    }
  };

  // Available categories list (from global API fetch — always shows all categories regardless of filter)
  const availableCategories = ['All', ...allCategories];

  // Helper to clear all active filters at once
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setShowLowStockOnly(false);
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
        onRefresh={() => {
          fetchProducts();
          fetchStats();
          showToast('Inventory synced with database', 'info');
        }}
        loading={loading}
      />

      {/* KPI Overview Metrics — reflects active filter */}
      <StatsOverview
        stats={displayStats}
        onFilterLowStock={() => setShowLowStockOnly((prev) => !prev)}
        isLowStockActive={showLowStockOnly}
      />

      {/* Interactive Controls Bar: Search, Category, Low-Stock Toggle */}
      <div className="controls-bar">
        {/* Search */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="input-search"
          />
        </div>

        {/* Filters */}
        <div className="filters-group">
          {/* Category Dropdown */}
          <div className="select-wrapper">
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                // Auto-reset Low Stock filter when switching category
                // to prevent confusing empty results from combined filters
                if (showLowStockOnly) setShowLowStockOnly(false);
              }}
              id="select-category"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="select-arrow" />
          </div>

          {/* Low Stock Toggle Button */}
          <button
            className={`toggle-filter-btn ${showLowStockOnly ? 'active' : ''}`}
            onClick={() => setShowLowStockOnly((prev) => !prev)}
            id="btn-low-stock-toggle"
          >
            <AlertTriangle size={15} />
            <span>Low Stock</span>
            {displayStats.lowStockCount > 0 && (
              <span className="filter-count-badge">{displayStats.lowStockCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Product List Table */}
      <ProductTable
        products={products}
        loading={loading}
        onEdit={(prod) => {
          setEditingProduct(prod);
          setIsModalOpen(true);
        }}
        onDelete={(prod) => setDeletingProduct(prod)}
        onQuickAdjustQuantity={handleQuickAdjustQuantity}
        activeFilters={{
          category: selectedCategory,
          lowStock: showLowStockOnly,
          search: searchQuery.trim()
        }}
        onClearFilters={clearAllFilters}
      />

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
        isSubmitting={saving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleting}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
