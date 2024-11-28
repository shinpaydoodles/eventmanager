
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;

