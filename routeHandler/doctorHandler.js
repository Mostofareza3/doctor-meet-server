const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const doctorSchema = require("../schemas/doctorSchema");
const DoctorsCollection = new mongoose.model("Doctor", doctorSchema);

// GET All by doctor
router.get("/all", async (req, res) => {
    // console.log("hit all");
    const { specialist, gender, page, rows } = req.query;
    // console.log(specialist, gender, page);

    let query = {};
    if (specialist === "All" && gender === "All") {
        query = {};
    } else if (specialist === "All") {
        query = { gender };
    } else if (gender === "All") {
        query = { specialist };
    } else {
        query = { specialist, gender };
    }
    // console.log(query);
    try {
        const LIMIT = rows;
        const startIndex = Number(page - 1) * LIMIT;
        const data = await DoctorsCollection.find(query)
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);
        const total = await DoctorsCollection.find(query).count();
        res.status(200).json({
            result: data,
            total: total,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "Donor not found.",
        });
    }
});

// GET specific doctor by ID
router.get("single/:id", async (req, res) => {
    try {
        const data = await DoctorsCollection.find({ _id: req.params.id });
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

//get doctor statistics data
router.get("/statistics", async (req, res) => {
    try {
        const specialistData = await DoctorsCollection.aggregate([
            { $group: { _id: "$specialist", count: { $sum: 1 } } },
            { $sort: { count: 1 } },
        ]);
        const experienceData = await DoctorsCollection.aggregate([
            { $group: { _id: "$experience", count: { $sum: 1 } } },
            { $sort: { count: 1 } },
        ]);
        const genderData = await DoctorsCollection.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } },
            { $sort: { count: 1 } },
        ]);
        const data = { specialistData, experienceData, genderData };

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

// post doctor information
router.post("/add", (req, res) => {
    const newDoctor = new DoctorsCollection(req.body);
    newDoctor.save((err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Doctor information was inserted successfully!",
            });
        }
    });
});

// update doctor information
router.put("/:id", (req, res) => {
    const data = req.body;
    const result = DoctorsCollection.findByIdAndUpdate(
        { _id: req.params.id },
        data,
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
                    message: "Doctor was updated successfully!",
                });
            }
        }
    );
});

// DELETE Doctor information
router.delete("/:id", (req, res) => {
    DoctorsCollection.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Doctor was deleted successfully!",
            });
        }
    });
});

module.exports = router;
