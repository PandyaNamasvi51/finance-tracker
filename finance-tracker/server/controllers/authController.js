const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/error');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, monthlyBudget: u.monthlyBudget });
const emailRegex = /^\S+@\S+\.\S+$/;

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please enter a valid email');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    res.status(409);
    throw new Error('Email already registered');
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json({ token: signToken(user._id), user: publicUser(user) });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// PATCH /api/auth/budget
exports.updateBudget = asyncHandler(async (req, res) => {
  const budget = Number(req.body.monthlyBudget);
  if (Number.isNaN(budget) || budget < 0) {
    res.status(400);
    throw new Error('Budget must be a non-negative number');
  }
  req.user.monthlyBudget = budget;
  await req.user.save();
  res.json({ user: publicUser(req.user) });
});
