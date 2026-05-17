import { gql } from 'graphql-tag';

export const categoryType = gql`
  type Category { id: ID!, name: String!, description: String }
  extend type Query { categories: [Category] }
  extend type Mutation { createCategory(name: String!, description: String): Category }
`;
