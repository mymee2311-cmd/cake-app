const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err.message);
    return;
  }

  console.log('Đã kết nối MySQL thành công!');
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cake App Backend đang chạy!',
  });
});

app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1 AS test', (err, results) => {
    if (err) {
      console.error('Lỗi test MySQL:', err.message);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: 'MySQL hoạt động!',
      data: results,
    });
  });
});

app.get('/api/products', (req, res) => {
  const sql = `
    SELECT
      p.product_id AS id,
      p.product_name AS name,
      p.description,
      p.price,
      p.image,
      p.stock,
      p.is_featured AS featured,
      c.category_name AS category_name
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.category_id
    WHERE p.is_active = TRUE
    ORDER BY p.product_id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi lấy sản phẩm:', err.message);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
});

app.get('/api/categories', (req, res) => {
  const sql = `
    SELECT
      category_id AS id,
      category_name AS name,
      image,
      description
    FROM categories
    ORDER BY category_id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi lấy danh mục:', err.message);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
});

app.get('/api/products/featured', (req, res) => {
  const sql = `
    SELECT
      p.product_id AS id,
      p.product_name AS name,
      p.description,
      p.price,
      p.image,
      p.stock,
      p.is_featured AS featured,
      c.category_name AS category_name
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.category_id
    WHERE p.is_featured = TRUE
      AND p.is_active = TRUE
    ORDER BY p.product_id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi lấy sản phẩm nổi bật:', err.message);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});