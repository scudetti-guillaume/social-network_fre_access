const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });
 mongoose
  .connect(
    process.env.DB_USER_MONGO +
      process.env.DB_USER_PASS +
       process.env.DB_USER_CLUSTER
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
