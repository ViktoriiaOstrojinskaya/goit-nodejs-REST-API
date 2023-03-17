const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const uuid = require("uuid");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");
const { User } = require("../models/user");
const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, "../public/avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `Email ${email} in use`);
  }
  const hashPassword = await bcryptjs.hashSync(
    password,
    bcryptjs.genSaltSync(10)
  );
  const avatarURL = gravatar.url(email, {}, false);
  const verificationToken = uuid.v4();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify you email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "User not verify");
  }
  const isValidPassword = await bcryptjs.compareSync(password, user.password);
  if (!isValidPassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
    subscription: user.subscription,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "20h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const updateSubscriptionUser = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const data = await User.findByIdAndUpdate(
    _id,
    { subscription },
    {
      new: true,
    }
  );
  if (!data) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(data);
};

const updateAvatarUser = async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const fileName = `${id}_${originalname}`;
  try {
    const image = await Jimp.read(tempUpload);
    await image
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(tempUpload);
    const resultUpload = path.join(avatarDir, fileName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("public", "avatars", fileName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

const verificationEmailUser = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.status(200).json({ message: "Verification successful" });
};

const resendVerificationEmailUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Missing required field email");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify you email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
  updateAvatarUser: ctrlWrapper(updateAvatarUser),
  verificationEmailUser: ctrlWrapper(verificationEmailUser),
  resendVerificationEmailUser: ctrlWrapper(resendVerificationEmailUser),
};
