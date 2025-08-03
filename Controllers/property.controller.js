
// // example usage in a controller
// import Property from '../Models/property.model.js';

// // create
// export const createProperty = async (req, res) => {
//   const newProp = await Property.create(req.body);
//   res.status(201).json(newProp);
// };

// // read list with filters
// export const getProperties = async (req, res) => {
//   const { type, city, status, minPrice, maxPrice } = req.query;
//   const filter = {
//     ...(type && { type }),
//     ...(city && { city }),
//     ...(status && { status }),
//     ...(minPrice && { price: { $gte: minPrice } }),
//     ...(maxPrice && {
//       price: { ...filter.price, $lte: maxPrice },
//     }),
//   };
//   const props = await Property.find(filter).sort({ createdAt: -1 });
//   res.json(props);
// };






// src/controllers/property.controller.js
import Property from '../Models/property.model.js';

// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import { generateToken } from '../Middlwares/auth.js';

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_HASHED_PW; // bcrypt-hashed

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL)
    return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, ADMIN_PASSWORD);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken({ role: 'admin' });
  res.json({ token });
};

/* -----------------------------------------------------------
   GET /api/properties?type=&city=&status=&minPrice=&maxPrice=
----------------------------------------------------------- */
export const getProperties = async (req, res) => {
  try {
    const { type, city, status, minPrice, maxPrice } = req.query;

    // build dynamic filter
    const filter = {
      ...(type && { type }),
      ...(city && { city }),
      ...(status && { status }),
    };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const list = await Property.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ------------------------ GET /api/properties/:id ------------------------ */
export const getPropertiesbyid = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------- POST /createproperty ------------------------ */
// export const createProperty = async (req, res) => {
//   try {
//     const newProp = await Property.create(req.body);
//     res.status(201).json(newProp);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: err.message });
//   }
// };

export const createProperty = async (req, res) => {
  try {
    /* 1️⃣ convert local filenames → public URLs */
    const host   = `${req.protocol}://${req.get('host')}`; // http://localhost:5000
    // const photos = req.files.map(f => `${host}/uploads/${f.filename}`);

    const photos = (req.files || []).map(f => `${host}/uploads/${f.filename}`);
    
    /* 2️⃣ compose payload – merge URLs with other form fields */
    const payload = {
      ...req.body,
      price: Number(req.body.price || 0),   // convert if needed
      photos,
    };

    /* 3️⃣ save to Mongo */
    const newProp = await Property.create(payload);
    res.status(201).json(newProp);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


/* ------------------------ PUT /:id/editproperty -------------------------- */
export const updateProperty = async (req, res) => {
  console.log("Incoming data to update:", req.body);

  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    console.log('updated');
    
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/* ----------------------- DELETE /:id/deleteproperty ---------------------- */
export const deleteProperty = async (req, res) => {
  try {
    const removed = await Property.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


/* -------------------- GET /api/properties/latest -------------------- */
/**
 * Returns the most recently-created properties.
 * Optional ?limit=N query string – defaults to 6.
 */
export const getLatestProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;          // fallback → 6
    const latest = await Property.find()
      .sort({ createdAt: -1 })                                 // newest first
      .limit(limit);

    res.json(latest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};




export const getResidentialProperties = async (req, res) => {
  try {
    const residentialProperties = await Property.find({ type: 'apartment' });
    res.json(residentialProperties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Residential - Apartments / villas / homes - for rent and sale 
// Commercial - Office spaces , retail shops , ware houses , land plots 
