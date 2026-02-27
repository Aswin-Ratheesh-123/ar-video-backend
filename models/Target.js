// const mongoose = require("mongoose");

// const targetSchema = new mongoose.Schema(
//   {
//     name: String,
//     imagePath: String,
//     videoPath: String,
//     index: Number
//   },
//   { timestamps: true }   // 🔥 ADD THIS
// );

// module.exports = mongoose.model("Target", targetSchema);

const mongoose = require("mongoose");

const targetSchema = new mongoose.Schema(
  {
    name: String,
    imagePath: String,
    videoPath: String,
    index: Number,
    companyName: String,   // 🔥 NEW
    companyUrl: String,
    companyLogo: String     // 🔥 NEW
  },
  { timestamps: true }
);

module.exports = mongoose.model("Target", targetSchema);
