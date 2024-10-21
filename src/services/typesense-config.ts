
import Typesense from 'typesense';
import dotenv from 'dotenv';

dotenv.config();

//Typsense Configuration
const typesenseClient = new Typesense.Client({
    nodes: [
        {
            host: 's6bw42o5hptgefjnp-1.a1.typesense.net',
            port: 443,
            protocol: 'https',
        },
    ],
    apiKey:'MhZtxNRPNH6Lplw7ejXd0AXEdPhXk9vj',

    connectionTimeoutSeconds: 2,
});
export default typesenseClient;
