const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Nama lengkap tidak boleh kosong"],
      maxlength: 32,
      validate: {
        validator: function (v) {
          return /^[^0-9][A-Za-z0-9\s]*$/.test(v);
        },
        message: (props) =>
          `${props.value} tidak valid. Pastikan nama tidak dimulai dengan angka.`,
      },
    },

    email: {
      type: String,
      trim: true,
      required: [true, "E-mail tidak boleh kosong"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Format email salah",
      ],
    },

    password: {
      type: String,
      trim: true,
      required: [true, "password tidak boleh kosong"],
      minlength: [6, "Password minimal 6 karakter"],
    },

    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

// encrypting password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// return JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });
};

module.exports = mongoose.model("User", userSchema);
