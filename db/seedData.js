const users = [
  {
    username: 'admin',
    password: 'adminpass123',
    email: 'admin@example.com',
    is_admin: true,
    name: 'Admin User',
    phone: '555-0100',
    mailing_address: '123 Admin St, Admin City, AC 12345',
    billing_info: 'Card ending in 0000'
  },
  {
    username: 'testuser1',
    password: 'userpass123',
    email: 'user1@example.com',
    is_admin: false,
    name: 'Test User One',
    phone: '555-0101',
    mailing_address: '456 User St, User City, UC 12345',
    billing_info: 'Card ending in 1111'
  },
  {
    username: 'testuser2',
    password: 'userpass456',
    email: 'user2@example.com',
    is_admin: false,
    name: 'Test User Two',
    phone: '555-0102',
    mailing_address: '789 User Ave, User City, UC 12345',
    billing_info: 'Card ending in 2222'
  }
];

const products = [
  {
    name: 'Laptop Pro X',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    price: 1299.99,
    image_url: 'https://example.com/images/laptop-pro-x.jpg',
    inventory_count: 50
  },
  {
    name: 'Smartphone Y',
    description: 'Latest smartphone with 5G capability and amazing camera',
    price: 799.99,
    image_url: 'https://example.com/images/smartphone-y.jpg',
    inventory_count: 100
  },
  {
    name: 'Wireless Earbuds Z',
    description: 'Premium wireless earbuds with noise cancellation',
    price: 199.99,
    image_url: 'https://example.com/images/earbuds-z.jpg',
    inventory_count: 200
  },
  {
    name: 'Smart Watch Series 4',
    description: 'Advanced smartwatch with health monitoring features',
    price: 299.99,
    image_url: 'https://example.com/images/smartwatch-4.jpg',
    inventory_count: 75
  },
  {
    name: 'Gaming Console XS',
    description: 'Next-gen gaming console with 4K graphics',
    price: 499.99,
    image_url: 'https://example.com/images/console-xs.jpg',
    inventory_count: 30
  },
  {
    name: 'Tablet Air',
    description: '10.9-inch tablet with retina display',
    price: 599.99,
    image_url: 'https://example.com/images/tablet-air.jpg',
    inventory_count: 60
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life',
    price: 49.99,
    image_url: 'https://example.com/images/wireless-mouse.jpg',
    inventory_count: 150
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with custom switches',
    price: 129.99,
    image_url: 'https://example.com/images/mech-keyboard.jpg',
    inventory_count: 80
  },
  {
    name: '4K Monitor',
    description: '27-inch 4K monitor with HDR support',
    price: 399.99,
    image_url: 'https://example.com/images/4k-monitor.jpg',
    inventory_count: 40
  },
  {
    name: 'Wireless Charger',
    description: 'Fast wireless charger with multiple device support',
    price: 39.99,
    image_url: 'https://example.com/images/wireless-charger.jpg',
    inventory_count: 120
  }
];

module.exports = {
  users,
  products
}; 