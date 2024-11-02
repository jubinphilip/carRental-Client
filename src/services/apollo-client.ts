
import { ApolloClient, InMemoryCache } from '@apollo/client';
import  createUploadLink  from 'apollo-upload-client/createUploadLink.mjs';
import {setContext} from '@apollo/client/link/context'
import getCookie from '@/utils/get-token';


//Setting up appollo client
const uploadLink = createUploadLink({
  uri: 'http://localhost:7000/graphql',
  credentials:'same-origin',
});

const authLink=setContext((_,{headers})=>
{
  const token=getCookie('token') || getCookie('usertoken');
  return{
    headers:{
      ...headers,
      authorization:token?`Bearer ${token}`:'',
    }
  }
})
const client = new ApolloClient({
  link:authLink.concat(uploadLink),//for uplading files upoadLink is used
  cache: new InMemoryCache(),
});

export default client;
