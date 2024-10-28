
import Typesense from 'typesense';
import dotenv from 'dotenv';

dotenv.config();

//Typsense Configuration
const typesenseClient = new Typesense.Client({
    nodes: [
        {
            host: '8hjpx7f3rdowgevsp-1.a1.typesense.net',
            port: 443,
            protocol: 'https',
        },
    ],
    apiKey:'7mSG4R1GBJkndMrt1mT2AwtmXG27eLYT',

    connectionTimeoutSeconds: 2,
});
export default typesenseClient;
