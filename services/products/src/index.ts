import { createRouter, Response } from "fets";
import { createServer } from "http";

const products = [
    {
        upc: '1',
        name: 'Table',
        price: 899,
        weight: 100,
    },
    {
        upc: '2',
        name: 'Couch',
        price: 1299,
        weight: 1000,
    },
    {
        upc: '3',
        name: 'Chair',
        price: 54,
        weight: 50,
    },
];

createServer(
    createRouter()
        .route({
            path: '/products/:upc',
            method: 'GET',
            handler: req => Response.json(products.find(product => product.upc === req.params.upc))
        })
        .route({
            path: '/products',
            method: 'GET',
            handler: () => Response.json(products)
        })
).listen(4002, () => {  
    console.log('Products service listening on port 4002');
});