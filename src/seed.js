import { connectDB } from './config/db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectDB();
  await Category.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();

  const cat = await Category.create({ name: 'Electronics', description: 'Gadgets' });
  await Product.create({ name: 'Smartphone', description: 'A phone', price: 499, stock: 50, category: cat._id });
  await Product.create({ name: 'Headphones', description: 'Nice sound', price: 99, stock: 200, category: cat._id });

  const hashed = await bcrypt.hash('password123', 10);
  await User.create({ name: 'Admin', email: 'admin@example.com', password: hashed, role: 'admin' });

  console.log('Seed done');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
