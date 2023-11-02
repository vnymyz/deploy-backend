const mongoose = require("mongoose");

const kategoriSchema = new mongoose.Schema({
  namakat: {
    type: String,
    required: true,
  },
  // jenis: {
  //   type: String,
  //   required: true,
  // },
});

const Kategori = mongoose.model("Kategori", kategoriSchema);

module.exports = Kategori;
