const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");

const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../helpers");
const { User } = require("../models/user");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `Email ${email} in use`);
  }
  const avatarURL = gravatar.url(email, {}, false);
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
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
  const isValidPassword = bcrypt.compareSync(password, user.password);
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

const avatarDir = path.join(__dirname, "../public/avatars");

const updateAvatarUser = async (req, res) => {
  const { path: tmpUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const imgName = `${id}_${originalname}`;
  try {
    const resultUpload = path.join(avatarDir, imgName);

    await fs.rename(tmpUpload, resultUpload);
    const avatarURL = path.join("avatars", imgName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tmpUpload);
    throw error;
  }
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
  updateAvatarUser: ctrlWrapper(updateAvatarUser),
};
