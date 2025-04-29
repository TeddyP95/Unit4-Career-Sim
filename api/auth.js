const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../db/client');

const authRouter = express.Router();
const SALT_ROUNDS = 10;
const { JWT_SECRET = 'nevertellanyone' } = process.env;

// Register a new user
authRouter.post('/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    
    // Check if username or email already exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length) {
      return res.status(400).json({
        error: 'Registration failed',
        message: 'Username or email is already taken'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create the user
    const result = await client.query(
      `INSERT INTO users (username, password, email)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, is_admin`,
      [username, hashedPassword, email]
    );

    const user = result.rows[0];

    // Create token
    const token = jwt.sign(user, JWT_SECRET);

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

// Login user
authRouter.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: 'Login failed',
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        error: 'Login failed',
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        is_admin: user.is_admin 
      }, 
      JWT_SECRET
    );

    // Remove password from user object
    delete user.password;

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  authRouter
}; 