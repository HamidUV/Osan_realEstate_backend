// // property.schema.js (Mongoose)
// {
//   title: String,          // “Cozy 2‑BR Apartment”
//   description: String,
//   type: String,           // “apartment”, “villa”, “office”… 
//   city: String,
//   price: Number,
//   status: String,         // “sale” | “rent”
//   photos: [String],       // S3 / Cloudinary URLs
//   address: String,
//   location: {             // For map pins
//     lat: Number,
//     lng: Number
//   },
//   createdAt: Date
// }



// src/models/Property.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    /** Basic categorisation */
    type: {
      type: String,
      enum: ['apartment', 'villa', 'office', 'studio', 'land', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['sale', 'rent'],
      default: 'sale',
    },

    /** Location & price */
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    mapEmbedUrl: {
      type: String, // <- NEW FIELD
      trim: true,
    },

    /** Media */
    photos: [
      {
        type: String, // store Cloudinary / S3 URLs
      },
    ],
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default model('Property', propertySchema);