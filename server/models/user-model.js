// user-model.js
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' },
  registrationDate: {type: Date,default: Date.now,},
  lastLoginDate: {type: Date,}});

export default model('User', UserSchema);

