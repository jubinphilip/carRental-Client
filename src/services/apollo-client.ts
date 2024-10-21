
import { ApolloClient, InMemoryCache } from '@apollo/client';
import  createUploadLink  from 'apollo-upload-client/createUploadLink.mjs';


//Setting up appollo client
const uploadLink = createUploadLink({
  uri: 'http://localhost:7000/graphql',
  credentials:'same-origin',
});

const client = new ApolloClient({
  link:uploadLink,//for uplading files upoadLink is used
  cache: new InMemoryCache(),
});

export default client;
