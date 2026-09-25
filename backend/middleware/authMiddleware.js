import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const extractToken = (req) => {
  // 1) Prefer the Authorization: Bearer <token> header (cross-site safe)
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }

  // 2) Fallback to the httpOnly cookie
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  return null;
};

export const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed' });
  }
};