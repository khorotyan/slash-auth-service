const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const { UNEXPECTED_ERROR } = require("./constants/ErrorMessages");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/users", userRoutes);

app.use((err, req, res, next) => {
  console.log({ message: err.message, stack: err.stack });
  res.status(500).json(UNEXPECTED_ERROR);
});

mongoose.set("useCreateIndex", true);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@slash-auth.mvcgd.mongodb.net/mainDB?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
