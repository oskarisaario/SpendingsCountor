import mongoose, { Types } from 'mongoose';


export interface IUser {
  username: string,
  password: string,
  spendings: [Types.ObjectId | null]
};

const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    require: true,
    min: 3,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  spendings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spending',
  }]
},{ timestamps: true} );


const User = mongoose.model<IUser>("User", UserSchema);

export default User;