import express, {NextFunction} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import authRoutes from '../routes/authRoutes'
import spendingRoutes from '../routes/spendingRoutes';

//For build
import path from 'path';

//For build
//const __dirname = path.resolve();

const app = express();
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/spendings', spendingRoutes);


//For build
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'client', 'dist, index.html'));
})


const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL!).then(() => {
  app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));


app.use((error: any, req: express.Request, res: express.Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});