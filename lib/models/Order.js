const pool = require('../utils/pool');

module.exports = class Order {
  id;
  quantity;

  constructor(row) {
    this.id = row.id;
    this.quantity = row.quantity;
  }

  static async insert({ quantity }) {
    const { rows } = await pool.query(
      'INSERT INTO orders (quantity) VALUES ($1) RETURNING *',
      [quantity]
    );
    return new Order(rows[0]);
  }
  static async select() {
    const { rows } = await pool.query(
      'SELECT * FROM orders',
    );
    return rows.map((row) => {
      return new Order(row);
    });
  }
  static async selectById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE orders.id = ($1)',
      [id]
    );
    return new Order(rows[0]);
  }
  static async changeById(id, quantity) {
    const { rows } = await pool.query(
      'UPDATE orders SET quantity = ($1) WHERE id = ($2) RETURNING *',
      [quantity, id]
    );
    return new Order(rows[0]);
  }
  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM orders WHERE id = ($1) RETURNING *',
      [id]
    );
    return new Order(rows[0]);
  }
};

