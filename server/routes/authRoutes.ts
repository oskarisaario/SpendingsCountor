import express from 'express';
import { register, signin, signout } from '../controllers/authController';



const router = express.Router();


router.post('/register', register);
router.post('/signin', signin);
router.get('/signout', signout);


export default router;