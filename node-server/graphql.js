import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';
import jwt from 'jsonwebtoken';
import User from './models/User.js';  

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

async function startGraphQLServer() {

    const server = new ApolloServer({
        typeDefs,
        resolvers,
      });
    
    const { url } = await startStandaloneServer(server, {
        listen: { port: process.env.GQL_PORT || 3001 },
    
        context: async ({ req }) => {
          const user = getUserFromToken(req);
          return { user, User };
        },
      });
    
    console.log(`Apollo GraphQL ready at ${url}graphql`);

}

export default startGraphQLServer;
