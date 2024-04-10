import mongoose from 'mongoose';


const Schema = mongoose.Schema;

export interface ISpending extends mongoose.Document {
  income: number,
  month: Date,
  spendings: Array<object>
};


const SpendingSchema = new Schema<ISpending>({
  income: {
    type: Number,
    required: true
  },
  month: {
    type: Date,
    required: true
  },
  spendings: [
    {
      class: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      }
    }
  ]
},{ timestamps: true} );


const Spending = mongoose.model<ISpending>("Spending", SpendingSchema);

export default Spending;