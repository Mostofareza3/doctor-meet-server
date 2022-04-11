const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const appointmentSchema = require("../schemas/appointmentSchema");
const Appointment = new mongoose.model("Appointment", appointmentSchema);
const checkLogin = require("../middleware/checkLogin");

// GET all appointment
router.get("/all", (req, res) => {
    Appointment.find({})
        .select({
            _id: 0,
            __v: 0,
            date: 0,
        })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    result: data,
                    message: "Success",
                });
            }
        });
});

// GET A appointment by ID
router.get("/:id", async (req, res) => {
    try {
        const data = await Appointment.find({ _id: req.params.id });
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

// POST An appointment
router.post("/", (req, res) => {
    const newAppointment = new Appointment(req.body);
    newAppointment.save((err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Appointment was inserted successfully!",
            });
        }
    });
});

// POST MULTIPLE Appointment
router.post("/all", (req, res) => {
    Appointment.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Appointment were inserted successfully!",
            });
        }
    });
});

// PUT Appointment
router.put("/:id", (req, res) => {
    const result = Appointment.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                status: "active",
            },
        },
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
                    message: "Appointment was updated successfully!",
                });
            }
        }
    );
    console.log(result);
});

// DELETE Appointment
router.delete("/:id", (req, res) => {
    Appointment.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Appointment was deleted successfully!",
            });
        }
    });
});

module.exports = router;
