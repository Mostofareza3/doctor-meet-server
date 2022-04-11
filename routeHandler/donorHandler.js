const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const donorSchema = require("../schemas/donorSchema");
const DonorCollection = new mongoose.model("Donor", donorSchema);
const checkLogin = require("../middleware/checkLogin");


// GET All by donor
router.get("/all", async (req, res) => {
    try {
        const data = await DonorCollection.find({});
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

// GET specific donor by ID
router.get("/:id", async (req, res) => {
    try {
        const data = await DonorCollection.find({ _id: req.params.id });
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

// post donor information
router.post("/add", (req, res) => {
    const newDonor = new DonorCollection(req.body);
    newDonor.save((err) => {
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

// update donor information
router.put("/:id", (req, res) => {
    const result = DonorCollection.findByIdAndUpdate(
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

// DELETE Donor information
router.delete("/:id", (req, res) => {
    DonorCollection.deleteOne({ _id: req.params.id }, (err) => {
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