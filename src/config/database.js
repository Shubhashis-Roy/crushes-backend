const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namasteNode:sroy@namastenode.kjfhv.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
