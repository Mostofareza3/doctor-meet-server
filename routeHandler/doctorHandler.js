const express = require("express");
const mongoose = require("mongoose");
// const router = express.Router();
const doctorSchema = require("../schemas/doctorSchema");
const DoctorsCollection = new mongoose.model("Doctor", doctorSchema);
const router = express.Router();

// GET All by doctor
router.get("/all", async (req, res) => {
    try {
        const data = await DoctorsCollection.find({});
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

// GET specific doctor by ID
router.get("/:id", async (req, res) => {
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
                message: "Donor information was inserted successfully!",
            });
        }
    });
});

// update doctor information
router.put("/:id", (req, res) => {
    const result = DoctorsCollection.findByIdAndUpdate(
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
                    message: "Donor was updated successfully!",
                });
            }
        }
    );
    console.log(result);
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
                message: "Donor was deleted successfully!",
            });
        }
    });
});

module.exports = router;