import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userType: 'admin' | 'nurse' | 'doctor';
  email: string;
  fireToken: string | null;
  firebaseUid: string;
}

const userSchema: Schema = new Schema({
  userType: {
    type: String,
    enum: ['admin', 'nurse', 'doctor'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fireToken: {
    type: String,
    nullable: true,
  },
  firebaseUid: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;