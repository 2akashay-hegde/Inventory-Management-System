const BASE_URL = '/products';

async function safeJson(response, fallbackMsg = 'Network request failed') {
  const text = await response.text();
  let data = null;
  if (text && text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  if (!response.ok) {
    const errorMsg = (data && data.message) || fallbackMsg;
    throw new Error(errorMsg);
  }
  return data || {};
}

export const productApi = {
  // 1. Get all products with optional search and category
  async getProducts(search = '', category = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);

    const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;
    const response = await fetch(url);
    return safeJson(response, 'Failed to fetch products');
  },

  // 2. Get low stock products
  async getLowStockProducts() {
    const response = await fetch(`${BASE_URL}/low-stock`);
    return safeJson(response, 'Failed to fetch low stock items');
  },

  // 3. Add product
  async createProduct(productData) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return safeJson(response, 'Failed to create product');
  },

  // 4. Update product
  async updateProduct(id, productData) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return safeJson(response, 'Failed to update product');
  },

  // 5. Delete product
  async deleteProduct(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return safeJson(response, 'Failed to delete product');
  },

  // 6. Get inventory summary metrics
  async getStats() {
    const response = await fetch(`${BASE_URL}/summary/stats`);
    return safeJson(response, 'Failed to fetch inventory metrics');
  }
};
