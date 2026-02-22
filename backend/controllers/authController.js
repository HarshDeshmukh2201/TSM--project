import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  res.cookie('token', token, { 
    httpOnly: true, 
    sameSite: 'strict', 
    maxAge: 604800000 
  });
  
  return token;
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const user = await User.create({ username, email, password });
    const token = generateToken(res, user._id);
    
    res.status(201).json({ 
      _id: user._id, 
      username: user.username,
      token: token
    });
  } catch (err) { 
    next(err); 
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(res, user._id);
    
    res.status(200).json({ 
      _id: user._id, 
      username: user.username,
      token: token 
    });
  } catch (err) { 
    next(err); 
  }
};

export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
};

export const verifyToken = async (req, res) => {
  res.status(200).json({ 
    valid: true,
    user: {
      _id: req.user._id,
      username: req.user.username
    }
  });
};