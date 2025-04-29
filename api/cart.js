const express = require('express');
const client = require('../db/client');
const { authRequired } = require('../middleware/auth');

const cartRouter = express.Router();

// Get user's cart
cartRouter.get('/', authRequired, async (req, res, next) => {
  try {
    const result = await client.query(
      `SELECT ci.id, ci.quantity, p.* 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.user_id = $1`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Add item to cart
cartRouter.post('/', authRequired, async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Check if product exists and has sufficient inventory
    const productResult = await client.query(
      'SELECT * FROM products WHERE id = $1',
      [product_id]
    );

    if (!productResult.rows.length) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    const product = productResult.rows[0];
    if (product.inventory_count < quantity) {
      return res.status(400).json({
        error: 'Insufficient inventory',
        message: 'The requested quantity is not available'
      });
    }

    // Check if item already exists in cart
    const existingItem = await client.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );

    let result;
    if (existingItem.rows.length) {
      // Update quantity if item exists
      result = await client.query(
        `UPDATE cart_items 
         SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND product_id = $3
         RETURNING *`,
        [quantity, req.user.id, product_id]
      );
    } else {
      // Add new item if it doesn't exist
      result = await client.query(
        `INSERT INTO cart_items (user_id, product_id, quantity)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [req.user.id, product_id, quantity]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update cart item quantity
cartRouter.patch('/:id', authRequired, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        error: 'Invalid quantity',
        message: 'Quantity must be greater than 0'
      });
    }

    // Verify item belongs to user
    const cartItem = await client.query(
      'SELECT * FROM cart_items WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (!cartItem.rows.length) {
      return res.status(404).json({
        error: 'Cart item not found',
        message: 'The requested cart item does not exist'
      });
    }

    // Check product inventory
    const product = await client.query(
      'SELECT inventory_count FROM products WHERE id = $1',
      [cartItem.rows[0].product_id]
    );

    if (quantity > product.rows[0].inventory_count) {
      return res.status(400).json({
        error: 'Insufficient inventory',
        message: 'The requested quantity is not available'
      });
    }

    const result = await client.query(
      `UPDATE cart_items 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Remove item from cart
cartRouter.delete('/:id', authRequired, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await client.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'Cart item not found',
        message: 'The requested cart item does not exist'
      });
    }

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    next(error);
  }
});

// Checkout (purchase items in cart)
cartRouter.post('/checkout', authRequired, async (req, res, next) => {
  try {
    // Start transaction
    await client.query('BEGIN');

    // Get cart items
    const cartItems = await client.query(
      `SELECT ci.*, p.inventory_count, p.price 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.user_id = $1`,
      [req.user.id]
    );

    if (!cartItems.rows.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Empty cart',
        message: 'Your cart is empty'
      });
    }

    // Verify inventory and update product quantities
    for (const item of cartItems.rows) {
      if (item.quantity > item.inventory_count) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: 'Insufficient inventory',
          message: `Not enough inventory for product ID ${item.product_id}`
        });
      }

      await client.query(
        'UPDATE products SET inventory_count = inventory_count - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear user's cart
    await client.query(
      'DELETE FROM cart_items WHERE user_id = $1',
      [req.user.id]
    );

    // Commit transaction
    await client.query('COMMIT');

    res.json({
      message: 'Checkout successful',
      items: cartItems.rows
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  }
});

module.exports = {
  cartRouter
}; 