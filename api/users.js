const express = require('express');
const client = require('../db/client');
const { authRequired, isAdmin } = require('../middleware/auth');

const usersRouter = express.Router();

// Get all users (admin only)
usersRouter.get('/', authRequired, isAdmin, async (req, res, next) => {
  try {
    const result = await client.query(
      `SELECT id, username, email, is_admin, created_at, name, phone, mailing_address
       FROM users
       ORDER BY id ASC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get user by ID (admin only)
usersRouter.get('/:id', authRequired, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await client.query(
      `SELECT id, username, email, is_admin, created_at, name, phone, mailing_address
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update user (admin only)
usersRouter.patch('/:id', authRequired, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, is_admin, name, phone, mailing_address } = req.body;

    // Build the update query dynamically based on provided fields
    const fields = [];
    const values = [];
    let valueCount = 1;

    if (username !== undefined) {
      fields.push(`username = $${valueCount}`);
      values.push(username);
      valueCount++;
    }
    if (email !== undefined) {
      fields.push(`email = $${valueCount}`);
      values.push(email);
      valueCount++;
    }
    if (is_admin !== undefined) {
      fields.push(`is_admin = $${valueCount}`);
      values.push(is_admin);
      valueCount++;
    }
    if (name !== undefined) {
      fields.push(`name = $${valueCount}`);
      values.push(name);
      valueCount++;
    }
    if (phone !== undefined) {
      fields.push(`phone = $${valueCount}`);
      values.push(phone);
      valueCount++;
    }
    if (mailing_address !== undefined) {
      fields.push(`mailing_address = $${valueCount}`);
      values.push(mailing_address);
      valueCount++;
    }

    if (fields.length === 0) {
      return res.status(400).json({
        error: 'Invalid update',
        message: 'No valid fields provided for update'
      });
    }

    const result = await client.query(
      `UPDATE users 
       SET ${fields.join(', ')}
       WHERE id = $${valueCount}
       RETURNING id, username, email, is_admin, created_at, name, phone, mailing_address`,
      [...values, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete user (admin only)
usersRouter.delete('/:id', authRequired, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.user.id) {
      return res.status(400).json({
        error: 'Invalid operation',
        message: 'You cannot delete your own account'
      });
    }

    const result = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  usersRouter
}; 