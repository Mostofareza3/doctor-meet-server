const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    reason: String,
    doctorName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = appointmentSchema;