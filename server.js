const app = require("./app");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const { PORT = 3000, DB_HOST } = process.env;

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
