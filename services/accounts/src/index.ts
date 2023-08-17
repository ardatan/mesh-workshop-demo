import { createRouter, FromSchema, Response } from 'fets';
import { createServer } from 'http';

const UserSchema = {
    title: 'User',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        birthDate: {
            type: 'string',
            format: 'date',
        },
        username: {
            type: 'string',
        }
    },
    required: ['id', 'name', 'birthDate', 'username'],
    additionalProperties: false
} as const;

const users: FromSchema<typeof UserSchema>[] = [
    {
        id: '1',
        name: 'Ada Lovelace',
        birthDate: '1815-12-10',
        username: '@ada',
    },
    {
        id: '2',
        name: 'Alan Turing',
        birthDate: '1912-06-23',
        username: '@complete',
    },
];

const router = createRouter({
    openAPI: {
        info: {
            title: 'Accounts Service',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:4001',
            }
        ],
    }
})
.route({
    operationId: 'userById',
    path: '/user/:id',
    method: 'GET',
    schemas: {
        request: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    }
                },
                required: ['id'],
                additionalProperties: false
            }
        },
        responses: {
            200: UserSchema,
            404: {
                title: 'NotFoundError',
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    },
                },
                required: ['message'],
                additionalProperties: false
            }
        }
    } as const,
    handler: req => {
        const user = users.find(user => user.id === req.params.id);
        if (!user) {
            return Response.json({
                message: 'User not found',
            }, {
                status: 404,
            })
        }
        return Response.json(user);
    }
})
.route({
    operationId: 'users',
    path: '/users',
    method: 'GET',
    schemas: {
        responses: {
            200: {
                title: 'Users',
                type: 'array',
                items: UserSchema,
            }
        }
    } as const,
    handler: () => Response.json(users)
});

createServer(router).listen(4001, () => {
    console.log('accounts service running on port 4001');
});