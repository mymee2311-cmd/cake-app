const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const fetch = require('node-fetch');
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
  res.json({ success: true, message: 'Cake App Backend đang chạy!' });
});

app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1 AS test', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: 'MySQL hoạt động!', data: results });
  });
});

/* ==================== PRODUCTS ==================== */

app.get('/api/products', (req, res) => {
  const sql = `
    SELECT
      p.product_id AS id,
      p.category_id AS category_id,
      p.product_name AS name,
      p.description,
      p.price,
      p.image,
      p.stock,
      p.is_featured AS featured,
      c.category_name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    WHERE p.is_active = TRUE
    ORDER BY p.product_id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi lấy sản phẩm:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: results });
  });
});

app.get('/api/categories', (req, res) => {
  const sql = `
    SELECT category_id AS id, category_name AS name, image, description
    FROM categories
    ORDER BY category_id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi lấy danh mục:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: results });
  });
});

app.get('/api/products/featured', (req, res) => {
  const sql = `
    SELECT
      p.product_id AS id,
      p.category_id AS category_id,
      p.product_name AS name,
      p.description,
      p.price,
      p.image,
      p.stock,
      p.is_featured AS featured,
      c.category_name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    WHERE p.is_featured = TRUE AND p.is_active = TRUE
    ORDER BY p.product_id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi lấy sản phẩm nổi bật:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: results });
  });
});

app.post('/api/products', (req, res) => {
  const { name, description, price, stock, category_id, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({ success: false, error: 'Thiếu tên hoặc giá sản phẩm' });
  }

  const sql = `
    INSERT INTO products 
      (category_id, product_name, description, price, image, stock, is_featured, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 0, 1)
  `;

  const values = [
    Number(category_id) || 1,
    String(name).trim(),
    String(description || '').trim(),
    Number(price),
    String(image || '').trim(),
    Number(stock) || 0,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Lỗi thêm sản phẩm:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    console.log('Đã thêm sản phẩm, ID =', result.insertId);
    res.json({
      success: true,
      message: 'Đã thêm sản phẩm thành công',
      data: { id: result.insertId },
    });
  });
});

app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, description, price, stock, category_id, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({ success: false, error: 'Thiếu tên hoặc giá sản phẩm' });
  }

  const sql = `
    UPDATE products 
    SET product_name = ?, description = ?, price = ?, image = ?, stock = ?, category_id = ?
    WHERE product_id = ?
  `;

  const values = [
    String(name).trim(),
    String(description || '').trim(),
    Number(price),
    String(image || '').trim(),
    Number(stock) || 0,
    Number(category_id) || 1,
    productId,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error('Lỗi cập nhật sản phẩm:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: 'Đã cập nhật sản phẩm' });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const sql = `UPDATE products SET is_active = 0 WHERE product_id = ?`;

  db.query(sql, [productId], (err) => {
    if (err) {
      console.error('Lỗi xóa sản phẩm:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: 'Đã xóa sản phẩm' });
  });
});

/* ==================== ORDERS ==================== */

app.post('/api/orders', (req, res) => {
  const {
    order_code, customer_name, customer_phone,
    address, payment_method, total, items,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Đơn hàng không có sản phẩm',
    });
  }

  const initialStatus =
    payment_method === 'cash' ? 'pending' : 'pending_payment';

  const orderSql = `
    INSERT INTO orders 
      (order_code, customer_name, customer_phone, address, payment_method, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const orderValues = [
    order_code,
    customer_name || 'Khách',
    customer_phone || '',
    address || '',
    payment_method || 'cash',
    Number(total) || 0,
    initialStatus,
  ];

  db.query(orderSql, orderValues, (err, result) => {
    if (err) {
      console.error('Lỗi tạo đơn hàng:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }

    const orderId = result.insertId;

    const itemSql = `
      INSERT INTO order_items 
        (order_id, product_id, product_name, price, quantity)
      VALUES ?
    `;

    const itemValues = items.map((item) => [
      orderId,
      item.id || null,
      item.name,
      Number(item.price),
      Number(item.quantity),
    ]);

    db.query(itemSql, [itemValues], (err2) => {
      if (err2) {
        console.error('Lỗi thêm order_items:', err2.message);
        return res.status(500).json({ success: false, error: err2.message });
      }

      console.log('Đã tạo đơn hàng, ID =', orderId, '| Status =', initialStatus);
      res.json({
        success: true,
        message: 'Đặt hàng thành công',
        data: { order_id: orderId, order_code, status: initialStatus },
      });
    });
  });
});

app.get('/api/orders', (req, res) => {
  const sql = `
    SELECT
      order_id AS id, order_code, customer_name, customer_phone,
      address, payment_method, total, status, created_at
    FROM orders
    ORDER BY order_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi lấy đơn hàng:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: results });
  });
});

app.get('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;

  const orderSql = `
    SELECT
      order_id AS id, order_code, customer_name, customer_phone,
      address, payment_method, total, status, created_at
    FROM orders WHERE order_id = ?
  `;

  db.query(orderSql, [orderId], (err, orderResults) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (orderResults.length === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy đơn' });
    }

    const itemSql = `
      SELECT item_id AS id, product_id, product_name AS name, price, quantity
      FROM order_items WHERE order_id = ?
    `;

    db.query(itemSql, [orderId], (err2, itemResults) => {
      if (err2) {
        return res.status(500).json({ success: false, error: err2.message });
      }
      res.json({
        success: true,
        data: { ...orderResults[0], items: itemResults },
      });
    });
  });
});

app.put('/api/orders/:id/status', (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const allowed = [
    'pending',
    'pending_payment',
    'confirmed',
    'delivering',
    'completed',
    'cancelled',
  ];

  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, error: 'Trạng thái không hợp lệ' });
  }

  const sql = `UPDATE orders SET status = ? WHERE order_id = ?`;

  db.query(sql, [status, orderId], (err) => {
    if (err) {
      console.error('Lỗi cập nhật đơn:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: 'Đã cập nhật trạng thái' });
  });
});

app.put('/api/orders/:id/confirm-payment', (req, res) => {
  const orderId = req.params.id;

  const sql = `
    UPDATE orders 
    SET status = 'pending' 
    WHERE order_id = ? AND status = 'pending_payment'
  `;

  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error('Lỗi xác nhận tiền:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy đơn hoặc đơn không ở trạng thái chờ nhận tiền',
      });
    }

    console.log('Đã xác nhận nhận tiền cho đơn ID =', orderId);

    res.json({
      success: true,
      message: 'Đã xác nhận nhận tiền',
    });
  });
});

/* ==================== GEOCODE PROXY ==================== */
app.get('/api/geocode', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({
      success: false,
      error: 'Thiếu địa chỉ',
    });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}&limit=1&addressdetails=1&accept-language=vi`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MeeBakery/1.0 (contact@meebakery.com)',
      },
    });

    const results = await response.json();

    if (!results || results.length === 0) {
      return res.json({
        success: false,
        error: 'Không tìm thấy địa chỉ',
      });
    }

    res.json({
      success: true,
      data: {
        lat: parseFloat(results[0].lat),
        lon: parseFloat(results[0].lon),
        formatted: results[0].display_name,
      },
    });
  } catch (err) {
    console.error('Lỗi geocode:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ==================== GEOCODE SEARCH ==================== */
app.get('/api/geocode/search', async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 3) {
    return res.json({ success: true, data: [] });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      q
    )}&limit=5&addressdetails=1&accept-language=vi&countrycodes=vn`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MeeBakery/1.0 (contact@meebakery.com)',
      },
    });

    const results = await response.json();

    const data = (results || []).map((r) => ({
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
      display_name: r.display_name,
      type: r.type,
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error('Lỗi geocode search:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ==================== SERVER ==================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server đang chạy trên port ${PORT}`);
}); ``