import { join } from 'path';
import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js';
import { load } from '@grpc/proto-loader';

const wrapServerWithReflection = require('grpc-node-server-reflection').default;

const inventory = [
    { upc: '1', inStock: 2 },
    { upc: '2', inStock: 3 },
    { upc: '3', inStock: 1 },
];

async function startServer() {
    const server: Server = wrapServerWithReflection(new Server());

    const packageDefinition = await load('./service.proto', {
        includeDirs: [join(__dirname, './proto')],
    });
    const grpcObject = loadPackageDefinition(packageDefinition);
    server.addService(grpcObject.InventoryService.service, {
        GetInventoryByUpc(call, callback) {
            callback(null, inventory.find(product => product.upc === call.request.upc));
        },
    });
    return new Promise<Server>((resolve, reject) => {
        server.bindAsync('0.0.0.0:4003', ServerCredentials.createInsecure(), (error, port) => {
            if (error) {
                reject(error);
                return;
            }
            server.start();

            console.log('Inventory Server started, listening: 0.0.0.0:' + port);
            resolve(server);
        });
    });
}

startServer().catch(e => {
    console.error(e);
    process.exit(1);
});