require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Wireless Ergonomic Keyboard',
    uniqueId: 'PRD-101',
    category: 'Electronics',
    price: 79.99,
    quantity: 35,
    minStock: 10
  },
  {
    name: 'Precision Gaming Mouse',
    uniqueId: 'PRD-102',
    category: 'Electronics',
    price: 49.50,
    quantity: 4, // LOW STOCK
    minStock: 10
  },
  {
    name: '27-inch 4K UHD Monitor',
    uniqueId: 'PRD-103',
    category: 'Electronics',
    price: 329.99,
    quantity: 8,
    minStock: 5
  },
  {
    name: 'USB-C Multi-Port Hub (7-in-1)',
    uniqueId: 'PRD-104',
    category: 'Accessories',
    price: 39.99,
    quantity: 2, // LOW STOCK
    minStock: 8
  },
  {
    name: 'Noise-Cancelling Headphones',
    uniqueId: 'PRD-105',
    category: 'Electronics',
    price: 189.00,
    quantity: 14,
    minStock: 5
  },
  {
    name: 'Adjustable Aluminium Laptop Stand',
    uniqueId: 'PRD-106',
    category: 'Accessories',
    price: 34.99,
    quantity: 22,
    minStock: 8
  },
  {
    name: 'Heavy Duty Thermal Shipping Label Printer',
    uniqueId: 'PRD-107',
    category: 'Office Supplies',
    price: 120.00,
    quantity: 3, // LOW STOCK
    minStock: 6
  },
  {
    name: 'Gel Ergonomic Wrist Rest Pad',
    uniqueId: 'PRD-108',
    category: 'Accessories',
    price: 14.95,
    quantity: 45,
    minStock: 15
  },
  {
    name: 'Recycled Shipping Boxes (Pack of 25)',
    uniqueId: 'PRD-109',
    category: 'Packaging',
    price: 28.50,
    quantity: 5, // LOW STOCK
    minStock: 10
  },
  {
    name: 'Reinforced Kraft Packing Tape (6 Rolls)',
    uniqueId: 'PRD-110',
    category: 'Packaging',
    price: 18.00,
    quantity: 50,
    minStock: 20
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventory_management';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    await Product.deleteMany({});
    console.log('[Seed] Cleared existing products');

    const created = await Product.insertMany(sampleProducts);
    console.log(`[Seed] Successfully inserted ${created.length} demo products`);

    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
