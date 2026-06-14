import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const categoryIds = {
  electronics: new mongoose.Types.ObjectId('665000000000000000000001'),
  fashion: new mongoose.Types.ObjectId('665000000000000000000002')
};

const productIds = {
  smartphone: new mongoose.Types.ObjectId('665000000000000000000101'),
  headphones: new mongoose.Types.ObjectId('665000000000000000000102'),
  tshirt: new mongoose.Types.ObjectId('665000000000000000000103')
};

async function seed() {
  await connectDB();
  await Category.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();

  const electronics = await Category.create({ _id: categoryIds.electronics, name: 'Electronics', description: 'Gadgets and devices' });
  const fashion = await Category.create({ _id: categoryIds.fashion, name: 'Fashion', description: 'Clothes and accessories' });

  await Product.create([
    {
      _id: productIds.smartphone,
      name: 'Smartphone',
      description: 'A modern smartphone with great battery life',
      price: 499,
      stock: 50,
      category: electronics._id,
      images: ['https://via.placeholder.com/600x400?text=Smartphone']
    },
    {
      _id: productIds.headphones,
      name: 'Headphones',
      description: 'Wireless headphones with clear sound',
      price: 99,
      stock: 200,
      category: electronics._id,
      images: ['https://via.placeholder.com/600x400?text=Headphones']
    },
    {
      _id: productIds.tshirt,
      name: 'T-Shirt',
      description: 'Cotton t-shirt for everyday wear',
      price: 25,
      stock: 150,
      category: fashion._id,
      images: ['https://via.placeholder.com/600x400?text=T-Shirt']
    }
  ]);

  const hashed = await bcrypt.hash('password123', 10);
  await User.create([
    { name: 'Admin', email: 'admin@example.com', password: hashed, role: 'admin' },
    { name: 'User One', email: 'user1@example.com', password: hashed, role: 'user' },
    { name: 'User Two', email: 'user2@example.com', password: hashed, role: 'user' }
  ]);

  console.log('Seed done');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
