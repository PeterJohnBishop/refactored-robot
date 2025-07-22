import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      return user;
    },

    users: async () => {
      return await User.find();
    },
  },

  Mutation: {
    register: async (_, { username, email, password }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      const token = jwt.sign(
        { user: { id: newUser._id, email: newUser.email } },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return { token, user: newUser };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = jwt.sign(
        { user: { id: user._id, email: user.email } },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return { token, user };
    },

    updateUser: async (_, { id, data }) => {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) throw new Error("User not found");
      return updatedUser;
    },

    deleteUser: async (_, { id }) => {
      const deleted = await User.findByIdAndDelete(id);
      return !!deleted;
    },
  },
};

export default resolvers;
