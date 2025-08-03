import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './Config/db.js';
import dotenv from 'dotenv';
import propertyroute from './Routes/property.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/properties',propertyroute );

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});