import express from 'express';
import { createSpending, getSpendings } from '../controllers/spendingControllers';
import { verifyToken } from '../middleware/auth';



const router = express.Router();


router.get('/userSpendings/:userId', verifyToken, getSpendings);
router.post('/createSpending/:userId', verifyToken, createSpending);



export default router;