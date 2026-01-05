import User from "../models/user.model.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

export const getUsers = async (req, res, next) => {
  try {
    const features = new ApiFeatures(User.find(), req.query)
      .filter()
      .paginate();

    const users = await features.query.select("-password");

    res.json({
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};
