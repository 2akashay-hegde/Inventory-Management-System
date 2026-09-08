const Product = require('../models/Product');

/**
 * @desc    Add new product
 * @route   POST /products
 */
exports.createProduct = async (req, res, next) => {
  try {
    const { name, uniqueId, category, price, quantity, minStock } = req.body;

    if (!name || !uniqueId || !category || price === undefined || quantity === undefined || minStock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, uniqueId, category, price, quantity, minStock'
      });
    }

    const trimmedUniqueId = uniqueId.trim().toUpperCase();

    // Check if uniqueId already exists
    const existing = await Product.findOne({ uniqueId: trimmedUniqueId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Unique ID "${trimmedUniqueId}" is already assigned to "${existing.name}"`
      });
    }

    const numPrice = Number(price);
    const numQty = Number(quantity);
    const numMinStock = Number(minStock);

    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ success: false, message: 'Price must be a non-negative number' });
    }
    if (isNaN(numQty) || numQty < 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a non-negative number' });
    }
    if (isNaN(numMinStock) || numMinStock < 0) {
      return res.status(400).json({ success: false, message: 'Minimum stock must be a non-negative number' });
    }

    const product = await Product.create({
      name: name.trim(),
      uniqueId: trimmedUniqueId,
      category: category.trim(),
      price: numPrice,
      quantity: numQty,
      minStock: numMinStock
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products (with optional search, category filter, and stats)
 * @route   GET /products
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { uniqueId: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get products with low stock (quantity <= minStock)
 * @route   GET /products/low-stock
 */
exports.getLowStockProducts = async (req, res, next) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$quantity', '$minStock'] }
    }).sort({ quantity: 1 });

    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /products/:id
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /products/:id
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, uniqueId, category, price, quantity, minStock } = req.body;
    const updateFields = {};

    if (uniqueId !== undefined) {
      const trimmedId = uniqueId.trim().toUpperCase();
      // Check if another product already has this uniqueId
      const conflict = await Product.findOne({ uniqueId: trimmedId, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(400).json({
          success: false,
          message: `Unique ID "${trimmedId}" is already assigned to "${conflict.name}"`
        });
      }
      updateFields.uniqueId = trimmedId;
    }

    if (name !== undefined) updateFields.name = name.trim();
    if (category !== undefined) updateFields.category = category.trim();
    if (price !== undefined) {
      const num = Number(price);
      if (isNaN(num) || num < 0) return res.status(400).json({ success: false, message: 'Invalid price' });
      updateFields.price = num;
    }
    if (quantity !== undefined) {
      const num = Number(quantity);
      if (isNaN(num) || num < 0) return res.status(400).json({ success: false, message: 'Invalid quantity' });
      updateFields.quantity = num;
    }
    if (minStock !== undefined) {
      const num = Number(minStock);
      if (isNaN(num) || num < 0) return res.status(400).json({ success: false, message: 'Invalid minStock' });
      updateFields.minStock = num;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /products/:id
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics & inventory summary
 * @route   GET /products/summary/stats
 */
exports.getInventoryStats = async (req, res, next) => {
  try {
    const [totalProducts, lowStockCount, aggregateStats, categories] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ $expr: { $lte: ['$quantity', '$minStock'] } }),
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalInventoryValue: { $sum: { $multiply: ['$price', '$quantity'] } },
            totalUnits: { $sum: '$quantity' },
            avgPrice: { $avg: '$price' }
          }
        }
      ]),
      Product.distinct('category')
    ]);

    const stats = aggregateStats[0] || {
      totalInventoryValue: 0,
      totalUnits: 0,
      avgPrice: 0
    };

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        totalInventoryValue: stats.totalInventoryValue || 0,
        totalUnits: stats.totalUnits || 0,
        avgPrice: stats.avgPrice || 0,
        categories: categories.sort()
      }
    });
  } catch (error) {
    next(error);
  }
};
