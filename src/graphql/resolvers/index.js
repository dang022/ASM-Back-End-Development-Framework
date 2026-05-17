import User from '../../models/User.js';
import Category from '../../models/Category.js';
import Product from '../../models/Product.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const signToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const resolvers = {
  Query: {
    me: async (_, __, { req }) => {
      if (!req.user) return null;
      return await User.findById(req.user._id).select('-password');
    },
    users: async () => await User.find().select('-password'),
    categories: async () => await Category.find(),
    products: async (_, { filter }) => {
      const q = {};
      if (filter?.category) q.category = filter.category;
      if (filter?.search) q.name = { $regex: filter.search, $options: 'i' };
      return await Product.find(q).populate('category');
    },
    product: async (_, { id }) => await Product.findById(id).populate('category')
  },
  Mutation: {
    register: async (_, { input }) => {
      const hashed = await bcrypt.hash(input.password, 10);
      const user = await User.create({ ...input, password: hashed });
      return user;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid credentials');
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error('Invalid credentials');
      return { token: signToken(user) };
    },
    createCategory: async (_, { name, description }) => await Category.create({ name, description }),
    createProduct: async (_, args) => await Product.create(args)
  }
};
