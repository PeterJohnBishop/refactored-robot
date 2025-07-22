import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from '../graphql/schema/typeDefs.js';
import resolvers from '../graphql/schema/resolvers.js';
import User from '../graphql/models/User.js';  
import getUserFromToken from '../graphql/middleware/auth.js'; 

async function startGraphQLServer() {

    const server = new ApolloServer({
        typeDefs,
        resolvers,
      });
    
    const { url } = await startStandaloneServer(server, {
        listen: { port: process.env.GQL_PORT || 3001 },
    
        context: async ({ req }) => {
          const user = await getUserFromToken(req);
          return { user, User };
        },
      });
    
    console.log(`Apollo GraphQL ready at ${url}graphql`);

}

export default startGraphQLServer;
