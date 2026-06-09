const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = 'supersecret_classifieds_key_123'; // In a real app use environment variable

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);
        
        db.run(`INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)`,
            [name, email, password_hash, phone || null],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Email already in use' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json({ id: this.lastID, name, email, phone });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login User
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        
        // Return user info and token without password
        const { password_hash, ...userInfo } = user;
        res.json({ token, user: userInfo });
    });
});

module.exports = { authRouter: router, JWT_SECRET };
