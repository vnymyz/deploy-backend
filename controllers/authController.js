const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");

// sign up
exports.signup = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorResponse("E-mail sudah terdaftar", 400));
  }
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// sign in
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email) {
      return next(new ErrorResponse("Email tidak boleh kosong", 403));
    }
    if (!password) {
      return next(new ErrorResponse("Password tidak boleh kosong", 403));
    }

    // check user and email
    // if we dont find the users email in our database when user try to sign in
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Email atau password salah", 400));
    }
    // check password
    // compare password in userModel
    // if the password is not matched then error when sign in
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return next(new ErrorResponse("Email atau password salah", 400));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// make send token response
// cookie will be expired in 1 hour
const sendTokenResponse = async (user, codeStatus, res) => {
  const token = await user.getJwtToken();
  const options = { maxAge: 60 * 60 * 1000, httpOnly: true };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(codeStatus).cookie("token", token, options).json({
    success: true,
    id: user._id,
    role: user.role,
    name: user.name,
  });
};

// logout
exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "logged out",
  });
};

// display user profile
exports.userProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json({
    success: true,
    user,
  });
};
