import { gql } from 'graphql-tag';

export const userType = gql`
  type User { id: ID!, name: String!, email: String!, role: String! }
  input RegisterInput { name: String!, email: String!, password: String! }
  type AuthPayload { token: String! }
`;

export const userQuery = gql`
  extend type Query { me: User, users: [User] }
`;

export const userMutation = gql`
  extend type Mutation { register(input: RegisterInput!): User, login(email: String!, password: String!): AuthPayload }
`;
