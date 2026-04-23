const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();
const connectDB = require('./db/db');


connectDB();

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = process.env.CLIENT_ORIGIN 
            ? process.env.CLIENT_ORIGIN.split(',').map(s => s.trim()) 
            : [];
        
        // Allow requests with no origin (like mobile apps or curl) or if origin is in whitelist
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.length === 0) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

app.use('/users', require('./routes/user.route'));
app.use('/tasks', require('./routes/task.route'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Server error' });
});

module.exports = app;
