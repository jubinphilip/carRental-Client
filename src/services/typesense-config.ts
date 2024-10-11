
import Typesense from 'typesense';
import dotenv from 'dotenv';

dotenv.config();


const typesenseClient = new Typesense.Client({
    nodes: [
        {
            host: '8k1gz5sr069ne4fbp-1.a1.typesense.net',
            port: 443,
            protocol: 'https',
        },
    ],
    apiKey:'sCRexZhJfCNus3tO5TR00lsAxjyknTvF',

    connectionTimeoutSeconds: 2,
});
export default typesenseClient;
