declare module 'apollo-upload-client' {
    export function createUploadLink(options: {
      uri: string;
      credentials?: string;
      headers?: Record<string, string>;
      fetchOptions?: RequestInit;
    }): any;
  }
  
  declare module '@/app/services/apollo-client' {
    import { ApolloClient, InMemoryCache } from '@apollo/client';
    const client: ApolloClient<InMemoryCache>;
    export default client;
  }
  