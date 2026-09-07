const BASE_URL = '/products';

export const productApi = {
  // 1. Get all products with optional search and category
  async getProducts(search = '', category = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);

    const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
    return data;
  },

  // 2. Get low stock products
  async getLowStockProducts() {
    const response = await fetch(`${BASE_URL}/low-stock`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch low stock items');
    return data;
  },

  // 3. Add product
  async createProduct(productData) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create product');
    return data;
  },

  // 4. Update product
  async updateProduct(id, productData) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  },

  // 5. Delete product
  async deleteProduct(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete product');
    return data;
  },

  // 6. Get inventory summary metrics
  async getStats() {
    const response = await fetch(`${BASE_URL}/summary/stats`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch inventory metrics');
    return data;
  }
};
