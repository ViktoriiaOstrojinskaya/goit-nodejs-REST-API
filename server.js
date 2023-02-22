const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const {
  PORT = 3000,
  DB_HOST = "mongodb+srv://viktoriia_ostrozhynska:aa2356ah@cluster0.whus9qg.mongodb.net/db-contacts?retryWrites=true&w=majority",
} = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT);
  })
  .then(() => {
    console.log(`Server is on ${PORT}`);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
