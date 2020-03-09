const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/APIuser");
const serviceRoutes = require("./routes/APIservice");

const port = process.env.PORT || 5000;
const mongoURI =
  "mongodb+srv://turbo-jobs:turbo-jobs@turbo-jobs-uqxyu.mongodb.net/test?retryWrites=true&w=majority";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/service/", serviceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
