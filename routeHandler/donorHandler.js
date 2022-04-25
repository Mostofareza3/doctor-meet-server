const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const donorSchema = require("../schemas/donorSchema");
const DonorCollection = new mongoose.model("Donor", donorSchema);
const checkLogin = require("../middleware/checkLogin");

// GET donor by search query
router.get("/", async (req, res) => {
    // console.log("get all with query hit");
    const { group, district, page, rows } = req.query;
    // console.log(group, district, page);

    let query = {};
    if (group === "All" && district === "All") {
        query = {};
    } else if (group === "All") {
        query = { district };
    } else if (district === "All") {
        query = { group };
    } else {
        query = { group, district };
    }
    // console.log(query);
    try {
        const LIMIT = rows;
        const startIndex = Number(page - 1) * LIMIT;
        const data = await DonorCollection.find(query)
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);
        const total = await DonorCollection.find(query).count();
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

// GET specific donor by ID
router.get("/single/:id", async (req, res) => {
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

//get donor statistics data
router.get("/statistics", async (req, res) => {
    try {
        const groupData = await DonorCollection.aggregate([
            { $group: { _id: "$group", count: { $sum: 1 } } },
            { $sort: { count: 1 } },
        ]);
        const districtData = await DonorCollection.aggregate([
            { $group: { _id: "$district", count: { $sum: 1 } } },
            { $sort: { count: 1 } },
        ]);
        const genderData = await DonorCollection.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } },
            { $sort: { count: 1 } },
        ]);
        const data = { groupData, districtData, genderData };

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
router.post("/add", async (req, res) => {
    const newDonor = new DonorCollection(req.body);
    //save new donor
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
    const data = req.body;
    const result = DonorCollection.findByIdAndUpdate(
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
                    message: "Donor was updated successfully!",
                });
            }
        }
    );
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
