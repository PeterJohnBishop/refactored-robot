import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import { requireAuth } from "./middleware.js";
import { 
    createUser, 
    authenticateUser,  
    getUserById,
    getAllUsers,
    updateUser,
    deleteUserById, 
} from "./users.js";

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await createUser(username, email, password);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authenticateUser(email, password);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.get('/users/:id', requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/users', requireAuth, async (_req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/users/:id', requireAuth, async (req, res) => {
  try {
    const updated = await updateUser(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/users/:id', requireAuth, async (req, res) => {
  try {
    const success = await deleteUserById(req.params.id);
    if (success) return res.json({ message: 'User deleted' });
    res.status(404).json({ error: 'User not found or already deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router