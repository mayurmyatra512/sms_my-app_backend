import dotenv from 'dotenv';
dotenv.config();
import connectToMongoDB from './src/config/mongodbconnection.js';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getDbConnection } from './src/config/mongodbconnection.js';
import cookieParser from 'cookie-parser';
import expressEjsLayouts from 'express-ejs-layouts';

import router from './src/routes/index.js';

const app = express();
const PORT = process.env.PORT || 3100;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:8080",
];

app.use(cors({
  origin:  function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.get('/api/health', (_req, res) => res.send('ok'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(expressEjsLayouts);

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use('/api', router);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectToMongoDB()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));
    
});