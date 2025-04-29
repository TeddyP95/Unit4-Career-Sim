const express = require('express');
const client = require('../db/client');
const { authRequired, isAdmin } = require('../middleware/auth');

const productsRouter = express.Router();

// Get all products (public)
productsRouter.get('/', async (req, res, next) => {
  try {
    const result = await client.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get single product (public)
productsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await client.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create product (admin only)
productsRouter.post('/', authRequired, isAdmin, async (req, res, next) => {
  try {
    const { name, description, price, image_url, inventory_count } = req.body;
    
    const result = await client.query(
      `INSERT INTO products (name, description, price, image_url, inventory_count)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, price, image_url, inventory_count]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update product (admin only)
productsRouter.patch('/:id', authRequired, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, inventory_count } = req.body;

    // Build the update query dynamically based on provided fields
    const fields = [];
    const values = [];
    let valueCount = 1;

    if (name !== undefined) {
      fields.push(`name = $${valueCount}`);
      values.push(name);
      valueCount++;
    }
    if (description !== undefined) {
      fields.push(`description = $${valueCount}`);
      values.push(description);
      valueCount++;
    }
    if (price !== undefined) {
      fields.push(`price = $${valueCount}`);
      values.push(price);
      valueCount++;
    }
    if (image_url !== undefined) {
      fields.push(`image_url = $${valueCount}`);
      values.push(image_url);
      valueCount++;
    }
    if (inventory_count !== undefined) {
      fields.push(`inventory_count = $${valueCount}`);
      values.push(inventory_count);
      valueCount++;
    }

    if (fields.length === 0) {
      return res.status(400).json({
        error: 'Invalid update',
        message: 'No valid fields provided for update'
      });
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    const result = await client.query(
      `UPDATE products 
       SET ${fields.join(', ')}
       WHERE id = $${valueCount}
       RETURNING *`,
      [...values, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete product (admin only)
productsRouter.delete('/:id', authRequired, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await client.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  productsRouter
}; 