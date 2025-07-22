
const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  register(username: String!, email: String!, password: String!): AuthPayload
  login(email: String!, password: String!): AuthPayload
  updateUser(id: ID!, data: UpdateUserInput!): User
  deleteUser(id: ID!): Boolean
}

input UpdateUserInput {
  username: String
  email: String
  password: String
}

`;

export default typeDefs;