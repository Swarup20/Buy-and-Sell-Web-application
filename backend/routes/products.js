const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../database');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./auth');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Multer config for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Missing authorization token' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Get all products (with optional search and category filters)
router.get('/', (req, res) => {
    const { search, category } = req.query;
    let query = 'SELECT products.*, users.name as seller_name FROM products JOIN users ON products.seller_id = users.id WHERE 1=1';
    const params = [];

    if (search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }
    
    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get single product
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT products.*, users.name as seller_name, users.phone as seller_phone, users.email as seller_email FROM products JOIN users ON products.seller_id = users.id WHERE products.id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Product not found' });
        res.json(row);
    });
});

// Post a new product ad
router.post('/', authenticateToken, upload.single('image'), (req, res) => {
    const { title, description, price, category } = req.body;
    const seller_id = req.user.id;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !price || !category) {
        return res.status(400).json({ error: 'Title, price, and category are required' });
    }

    db.run(`INSERT INTO products (title, description, price, category, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, price, category, image_url, seller_id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ 
                id: this.lastID, title, description, price, category, image_url, seller_id 
            });
        }
    );
});

module.exports = router;
