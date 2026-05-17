import { gql } from 'graphql-tag';

export const productType = gql`
  type Product { id: ID!, name: String!, description: String, price: Float!, stock: Int, category: Category }
  input ProductFilter { category: ID, minPrice: Float, maxPrice: Float, search: String, page: Int, limit: Int }
  extend type Query { products(filter: ProductFilter): [Product], product(id: ID!): Product }
  extend type Mutation { createProduct(name: String!, price: Float!, description: String, stock: Int, category: ID): Product }
`;
