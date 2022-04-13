const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userHandler = require("./routeHandler/userHandler");
const appointmentHandler = require("./routeHandler/appointmentHandler")
const donorHandler = require("./routeHandler/donorHandler");
const doctorHandler = require("./routeHandler/doctorHandler");
const medicineHandler = require("./routeHandler/medicineHandler");
const cors = require("cors");


// express app initialization
const app = express();
dotenv.config()
app.use(express.json());

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions));


const port = process.env.PORT || 5000;

// database connection with mongoose
mongoose
    .connect("mongodb+srv://doctors-meet:doctors-meet123@cluster0.myaif.mongodb.net/doctorsMeet?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("connection successful"))
    .catch((err) => console.log(err));

// application routes
app.get("/", (req, res) => {
    res.send("hello from server")
})
app.use("/user", userHandler);
app.use("/appointment", appointmentHandler);
app.use("/donor", donorHandler);
app.use("/doctors", doctorHandler);
app.use("/medicine", medicineHandler);


// default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
}

app.use(errorHandler);

app.listen(port, () => {
    console.log(`app listening at port ${port}`);
});
