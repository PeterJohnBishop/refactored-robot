import jwt from 'jsonwebtoken';

const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.user;
    } catch {
      throw new Error("Invalid/Expired token");
    }
  }
  return null;
};

export default getUserFromToken;