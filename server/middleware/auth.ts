import {NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    user?: any;
  }
};


export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      return res.status(403).send('Access denied!');
    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimStart();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = verified;
    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
};