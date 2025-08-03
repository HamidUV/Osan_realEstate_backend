// routes/propertyRoutes.js
import { Router } from 'express';
import {
  createProperty,
  getProperties, getPropertiesbyid, getLatestProperties, updateProperty, deleteProperty,
  login
} from '../Controllers/property.controller.js';
import { uploadLocal } from '../Middlwares/uploadLocal.js';
import { protect, adminOnly } from '../Middlwares/auth.js';
import multer from 'multer';
const upload = multer(); // parses form-data without files




const router = Router();

// Public routes
router.get('/', getProperties);
router.get('/latest', getLatestProperties);
router.get('/:id', getPropertiesbyid);

router.post('/login', login);
// Admin-only CRUD
router.post(
  '/createproperty',
  protect,
  adminOnly,
  uploadLocal.array('photos', 10),
  createProperty
);
// Expect photos (files) and text fields
router.put('/:id/editproperty',protect, adminOnly, uploadLocal.array('photos', 10), updateProperty);
router.delete('/:id/deleteproperty',protect, adminOnly, deleteProperty);
// protect, adminOnly, 
export default router;
