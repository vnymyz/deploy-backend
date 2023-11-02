const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dftakjyma",
  api_key: "516241759981154",
  api_secret: "FzJPG7e_70lWp4gomeihlGsegJw",
});

module.exports = cloudinary;
