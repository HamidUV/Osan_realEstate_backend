// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/* -----------------------------------------------------------
   1)  Issue a new JWT   (use in your login or seed script)
----------------------------------------------------------- */
export const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
// payload could be { id: user._id, role: 'admin' }

/* -----------------------------------------------------------
   2)  Gatekeeper: attaches decoded user to req.user
----------------------------------------------------------- */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ➜ now req.user.id, req.user.role are available
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

/* -----------------------------------------------------------
   3)  Optional: restrict to admin role
----------------------------------------------------------- */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};