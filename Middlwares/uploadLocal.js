// src/middleware/uploadLocal.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// 1️⃣ compute absolute project root (ES-module friendly)
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 2️⃣ define physical folder → /uploads
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

// 3️⃣ use multer.diskStorage so we keep the original filename
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext    = path.extname(file.originalname);
    cb(null, unique + ext); // e.g. 1690829254123-123456789.jpg
  },
});

export const uploadLocal = multer({ storage });