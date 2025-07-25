import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: String,
});

const User = mongoose.model("User", userSchema);

export default User;