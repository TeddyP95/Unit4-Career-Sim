const client = require('./client');
const bcrypt = require('bcrypt');
const { products, users } = require('./seedData');

async function dropTables() {
  try {
    console.log('Dropping tables...');
    await client.query(`
      DROP TABLE IF EXISTS cart_items;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
    `);
    console.log('Tables dropped successfully!');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
}

async function createTables() {
  try {
    console.log('Creating tables...');
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255),
        phone VARCHAR(20),
        mailing_address TEXT,
        billing_info TEXT
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        inventory_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      );
    `);
    console.log('Tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log('Creating initial users...');
    const SALT_ROUNDS = 10;

    const usersToCreate = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    const userValues = usersToCreate.map((user, index) => `
      ($${index * 8 + 1}, $${index * 8 + 2}, $${index * 8 + 3}, $${index * 8 + 4}, $${index * 8 + 5}, $${index * 8 + 6}, $${index * 8 + 7}, $${index * 8 + 8})
    `).join(',');

    const userParams = usersToCreate.flatMap(user => [
      user.username,
      user.password,
      user.email,
      user.is_admin,
      user.name,
      user.phone,
      user.mailing_address,
      user.billing_info
    ]);

    await client.query(`
      INSERT INTO users (username, password, email, is_admin, name, phone, mailing_address, billing_info)
      VALUES ${userValues}
      RETURNING *;
    `, userParams);

    console.log('Initial users created successfully!');
  } catch (error) {
    console.error('Error creating initial users:', error);
    throw error;
  }
}

async function createInitialProducts() {
  try {
    console.log('Creating initial products...');

    const productValues = products.map((product, index) => `
      ($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})
    `).join(',');

    const productParams = products.flatMap(product => [
      product.name,
      product.description,
      product.price,
      product.image_url,
      product.inventory_count
    ]);

    await client.query(`
      INSERT INTO products (name, description, price, image_url, inventory_count)
      VALUES ${productValues}
      RETURNING *;
    `, productParams);

    console.log('Initial products created successfully!');
  } catch (error) {
    console.error('Error creating initial products:', error);
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
  } catch (error) {
    console.error('Error during rebuildDB:', error);
    throw error;
  } finally {
    client.end();
  }
}

rebuildDB()
  .catch(console.error)
  .finally(() => console.log('Database rebuild completed.')); 