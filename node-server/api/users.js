import { GraphQLClient, gql } from 'graphql-request';

const graphqlEndpoint = 'http://localhost:3001/graphql'; // adjust if needed
const client = new GraphQLClient(graphqlEndpoint);

export async function createUser(username, email, password) {
  const mutation = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
      register(username: $username, email: $email, password: $password) {
        token
        user {
          id
          email
          username
        }
      }
    }
  `;

  const variables = { username, email, password };
  const response = await client.request(mutation, variables);
  return response.register;
}

export async function authenticateUser(email, password) {
  const mutation = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          email
          username
        }
      }
    }
  `;

  const variables = { email, password };
  const response = await client.request(mutation, variables);
  return response.login;
}

export async function getUserById(id) {
  const query = gql`
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        username
        email
      }
    }
  `;

  const variables = { id };
  const response = await client.request(query, variables);
  return response.user;
}

export async function getAllUsers() {
  const query = gql`
    query {
      users {
        id
        username
        email
      }
    }
  `;

  const response = await client.request(query);
  return response.users;
}

export async function updateUser(id, data) {
  const mutation = gql`
    mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
      updateUser(id: $id, data: $data) {
        id
        username
        email
      }
    }
  `;

  const variables = { id, data };
  const response = await client.request(mutation, variables);
  return response.updateUser;
}

export async function deleteUserById(id) {
  const mutation = gql`
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `;

  const variables = { id };
  const response = await client.request(mutation, variables);
  return response.deleteUser;
}