import jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Create JWT token
export const createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.encode(payload, JWT_SECRET);
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.decode(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware: authenticate request
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  next();
};

// Middleware: check role
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

