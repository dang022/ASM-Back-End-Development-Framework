import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
// use express.json() for body parsing
import { userType, userQuery, userMutation } from './schemas/user.js';
import { categoryType } from './schemas/category.js';
import { productType } from './schemas/product.js';
import { resolvers } from './resolvers/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();

const typeDefs = [
  `type Query { _empty: String }`,
  `type Mutation { _empty: String }`,
  userType, userQuery, userMutation, categoryType, productType
];

const schema = makeExecutableSchema({ typeDefs, resolvers });

export async function mountGraphql(app) {
  const server = new ApolloServer({ schema });
  await server.start();
  app.use('/graphql', express.json(), expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization;
      if (auth) {
        try {
          const token = auth.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id).select('-password');
          return { req, user };
        } catch (e) { return { req }; }
      }
      return { req };
    }
  }));
}
