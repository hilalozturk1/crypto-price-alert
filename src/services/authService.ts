import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { User, IUser } from "../models/user";
import { CustomError } from "../utils/errorHandlers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";
const JWT_EXPIRES_IN = "7d";

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(32).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

export const registerUser = async (
  username: string,
  email: string,
  password: string,
): Promise<IUser> => {
  const { error } = registerSchema.validate({ username, email, password });
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }
  const existing = await User.findOne({ email });
  if (existing) {
    throw new CustomError("Email already in use", 409);
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  const userObj = user.toObject();
  delete userObj.password;
  return userObj as IUser;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<{ token: string }> => {
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw new CustomError("Invalid credentials", 401);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials", 401);
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return { token };
};
