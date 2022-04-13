const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema({

    img1: {
        type: String,
        required: true
    },
    img2: {
        type: String,
        required: true
    },
    img3: {
        type: String,
        required: true
    },
    img4: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    inStock: {
        type: Boolean,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    Sku: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    power: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    rating: { type: Number },
    shopAddress: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

module.exports = medicineSchema;