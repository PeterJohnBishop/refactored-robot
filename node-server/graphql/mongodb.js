import mongoose from "mongoose";

const connectMongo = async (socket) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    socket.send(JSON.stringify({
      event: "connect",
      data: "MongoDB connected"
    }));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectMongo;