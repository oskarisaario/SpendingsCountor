import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import Spending from '../models/Spendings';
import { ISpending } from '../models/Spendings';
import { errorHandler } from '../utils/error';
import mongoose from 'mongoose';



//Create Monthly spending
export const createSpending = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    //SAVE NEW SPENDING
    if(req.body.replaceOld === false){
      console.log('uusi')
      const newSpending = new Spending({
        income: req.body.formData.income,
        date: req.body.formData.month,
        spendings: req.body.formData.spendings
      });
      const savedSpending = await newSpending.save();

      const user = await User.findById(userId);

      user?.spendings.push(savedSpending._id);
      await user?.save();

      res.status(200).json(savedSpending);
    } else {
      //REPLACE OLD SPENDING
      const updatedSpending = await Spending.findByIdAndUpdate(req.body.replaceId, {
        $set: {
          income: req.body.formData.income,
          date: req.body.formData.month,
          spendings: req.body.formData.spendings
        }
      }, {new: true});
      res.status(200).json(updatedSpending);
    }
  } catch (error: any) {
    console.log('Error: ', error);
    next(error);
  }
};


//Get users spendings
export const getSpendings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('spendings');
    res.status(200).json(user?.spendings);
  } catch (err:any) {
    res.status(404).json({ message: err.message });
  }
};