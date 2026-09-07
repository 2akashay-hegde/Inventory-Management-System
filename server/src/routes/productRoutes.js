const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getLowStockProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getInventoryStats
} = require('../controllers/productController');

// High level metrics
router.get('/summary/stats', getInventoryStats);

// Low stock products endpoint (Requirement 5)
router.get('/low-stock', getLowStockProducts);

// Standard CRUD endpoints
router.route('/')
  .post(createProduct)    // Requirement 1: Add product (POST /products)
  .get(getProducts);      // Requirement 2: Get all products (GET /products)

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)     // Requirement 3: Update product (PUT /products/:id)
  .delete(deleteProduct); // Requirement 4: Delete product (DELETE /products/:id)

module.exports = router;
