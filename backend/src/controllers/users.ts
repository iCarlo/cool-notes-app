import { RequestHandler } from "express"
import createHttpError from "http-errors";
import UserModel from '../models/user';
import bcrypt from 'bcrypt';


export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {

  try {
    const user = await UserModel.findById(req.session.userId).select('+email').exec();

    res.status(200).json(user);
  } catch (err) {
    next(err)
  }
}

interface SignUpBody {
  username?: string,
  email?: string,
  password?: string
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
  const { username, email } = req.body;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Parameters missing")
    }

    const existingUsername = await UserModel.findOne({ username }).exec();
    if (existingUsername) {
      throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.")
    }

    const existingEmail = await UserModel.findOne({ email }).exec();
    if (existingEmail) {
      throw createHttpError(409, "A user with this email already exist. Please log in instead.")
    }

    const password = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({ username, email, password });

    req.session.userId = newUser._id;

    res.status(201).json(newUser);

  } catch (err) {
    next(err);
  }
}


interface SignInBody {
  username?: string,
  password?: string
}

export const login: RequestHandler<unknown, unknown, SignInBody, unknown> = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username }).select("+password +email").exec();

    if (!user) {
      throw createHttpError(401, "Invalid credential");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credential");
    }

    req.session.userId = user._id;

    res.status(200).json(user);

  } catch (err) {
    next(err);
  }
}

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err)
    } else {
      res.sendStatus(200);
    }
  })
}