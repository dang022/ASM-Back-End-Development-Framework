import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';

dotenv.config();

const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const password = process.env.ADMIN_PASSWORD || 'password123';
const name = process.env.ADMIN_NAME || 'Admin';

async function createAdmin() {
  await connectDB();
  const hashed = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = 'admin';
    existing.password = hashed;
    existing.name = name;
    await existing.save();
    console.log(`Admin user updated: ${email}`);
  } else {
    await User.create({ name, email, password: hashed, role: 'admin' });
    console.log(`Admin user created: ${email}`);
  }
  process.exit(0);
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
