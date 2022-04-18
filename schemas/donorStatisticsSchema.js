const mongoose = require("mongoose");

const donorStatisticsSchema = mongoose.Schema(
    {
        group: {
            type: String,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = donorStatisticsSchema;
