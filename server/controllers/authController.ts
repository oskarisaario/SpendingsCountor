import { NextFunction, Request, Response } from 'express';
import bcrypt from  'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Spending, { ISpending } from '../models/Spendings';
import { errorHandler } from '../utils/error';



//Register User
export const register = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error: any) {
    console.log('Error: ', error);
    next(error);
  }
};


//login user
export const signin = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const currentUser = await User.findOne({ username }).populate('spendings');

    if (!currentUser) return next(errorHandler('404', 'User not found!'));

    const  userFound = await bcrypt.compare(password, currentUser.password);
    if (!userFound) return next(errorHandler('401', 'Wrong credentials!'));

    const token = jwt.sign({ id:currentUser._id }, process.env.JWT_SECRET!);
    currentUser.password = '';
    res.status(200).json({ token, currentUser });
  } catch (error: any) {
    console.log('Error: ', error);
    next(error);
  }
};


//Logout user
export const signout = async(req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('You have logged out!')
  } catch (error:any) {
    next(error);
  }
};