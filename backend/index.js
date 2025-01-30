const express = require("express");
const cors = require("cors");

const con = require("./connection/conn");

const auth = require("./routes/auth");
const product = require("./routes/product");
const order = require("./routes/order");
const admin = require("./routes/admin");
const result = require("./routes/result");

import "dotenv/config";
const port = process.env.PORT || 9000;

const app = express();
app.use(express.json())

app.use(cors());

con.connectDB();


const fileUpload = require("express-fileupload");
app.use(fileUpload({
    useTempFiles: true
}))


app.use("/api/v1/", auth);
app.use("/api/v2/", product);
app.use("/api/v3/", order);
app.use("/api/v4/", admin);
app.use("/api/v5/", result);


app.listen(port, () => {
    console.log("connected...");
});