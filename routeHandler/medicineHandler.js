const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const medicineSchema = require("../schemas/medicineSchema");
const MedicineCollection = new mongoose.model("Medicine", medicineSchema);

// GET All by medicine
router.get("/all", async (req, res) => {
    const { page, rows } = req.query;
    let query = {};
    try {
        const LIMIT = rows;
        const startIndex = Number(page - 1) * LIMIT;
        const data = await MedicineCollection.find(query)
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);
        const total = await MedicineCollection.find(query).count();
        res.status(200).json({
            result: data,
            total: total,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// GET specific Medicine by ID
router.get("/:id", async (req, res) => {
    try {
        const data = await MedicineCollection.find({ _id: req.params.id });
        res.status(200).json({
            result: data,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// post Medicine information
router.post("/add", (req, res) => {
    const newMedicine = new MedicineCollection(req.body);
    newMedicine.save((err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Medicine was inserted successfully!",
            });
        }
    });
});

// update donor information
router.put("/:id", (req, res) => {
    const result = MedicineCollection.findByIdAndUpdate(
        { _id: req.params.id },
        {
            new: true,
            useFindAndModify: false,
        },
        (err) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    message: "Medicine was updated successfully!",
                });
            }
        }
    );
});

// DELETE Medicine information
router.delete("/:id", (req, res) => {
    MedicineCollection.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Medicine was deleted successfully!",
            });
        }
    });
});

module.exports = router;
