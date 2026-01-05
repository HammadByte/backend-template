import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/token.js";

/* REGISTER */
export const register = async (req, res) => {
  const user = await User.create(req.body);

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    accessToken,
    refreshToken,
    user
  });
};

/* LOGIN */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    accessToken,
    refreshToken,
    user
  });
};

/* REFRESH TOKEN */
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const user = await User.findOne({ refreshToken }).select("+refreshToken");
  if (!user) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403);

      const newAccessToken = generateAccessToken(user._id);
      res.json({ accessToken: newAccessToken });
    }
  );
};

/* LOGOUT */
export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.sendStatus(204);
};
