import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';
import connectMongo from './db.js';
import User from './models/User.js';  // import your User model

dotenv.config();
connectMongo();

const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.user;
    } catch {
      throw new Error("Invalid or expired token");
    }
  }
  return null;
};

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.NODE_PORT || 3000 },

    context: async ({ req }) => {
      const user = getUserFromToken(req);
      return { user, User };
    },
  });

  console.log(`Apollo Server ready at ${url}`);
}

start().catch(console.error);
