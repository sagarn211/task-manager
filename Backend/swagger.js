const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0'
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Alice' },
            email: { type: 'string', example: 'alice@example.com' },
            password: { type: 'string', example: 'secret123' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'alice@example.com' },
            password: { type: 'string', example: 'secret123' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '661c9f0e2f9d9f0012a3b456' },
            name: { type: 'string', example: 'Alice' },
            email: { type: 'string', example: 'alice@example.com' },
            role: { type: 'string', example: 'user' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        TaskCreateRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Buy groceries' },
            description: { type: 'string', example: 'Milk, eggs, bread' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], example: 'pending' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            priority: { type: 'string' },
            user: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    tags: [
      { name: 'Users' },
      { name: 'Tasks' }
    ],
    paths: {
      '/users/register': {
        post: {
          tags: ['Users'],
          summary: 'Register user',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } }
          },
          responses: {
            201: {
              description: 'Created',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
            },
            400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/users/login': {
        post: {
          tags: ['Users'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } }
          },
          responses: {
            200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/users/logout': {
        post: {
          tags: ['Users'],
          summary: 'Logout (blacklist token)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'OK' },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Get tasks',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create task',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskCreateRequest' } } }
          },
          responses: {
            201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
            400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/tasks/{id}': {
        put: {
          tags: ['Tasks'],
          summary: 'Update task',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskCreateRequest' } } }
          },
          responses: {
            200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
            400: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete task',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'OK' },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      }
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(options);

