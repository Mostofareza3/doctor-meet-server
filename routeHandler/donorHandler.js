const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const donorSchema = require("../schemas/donorSchema");
const DonorCollection = new mongoose.model("Donor", donorSchema);
const checkLogin = require("../middleware/checkLogin");


// GET All by donor
// router.get("/all", async (req, res) => {

//     console.log("get all hit")
//     const { page } = req.query;
//     try {

//         const LIMIT = 6;
//         const startIndex = Number((page) - 1) * LIMIT;
//         const total = await DonorCollection.countDocuments({});
//         const data = await DonorCollection.find({}).sort({ _id: -1 }).limit(LIMIT).skip(startIndex).lean();
//         res.status(200).json({
//             result: data,
//             message: "Success",
//             total: total
//         });
//     } catch (err) {
//         res.status(500).json({
//             error: "There was a server side error!",
//         });
//     }
// });

router.get("/all/:group", async (req, res) => {
    // console.log("get all with query hit");
    const { district, page } = req.query;
    const { group } = req.params;
    // console.log(req.params);
    let query = {};
    if (group === 'All' && district === 'All') {
        query = {}
    } else if (group === 'All') {
        query = { district }
    } else if (district === 'All') {
        query = { group }
    } else {
        query = { group, district }
    }
    // console.log(query);
    try {

        const LIMIT = 6;
        const startIndex = Number((page) - 1) * LIMIT;
        const data = await DonorCollection.find(query).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        const total = await DonorCollection.countDocuments({});
        res.status(200).json({
            result: data,
            total: total,
            message: "Success",
        })
    } catch (err) {
        res.status(500).json({
            error: "Donor not found."
        })
    }
})

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