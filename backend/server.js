const express = require('express');
const cors = require('cors');
const path = require('path');

const { authRouter } = require('./routes/auth');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5002; // Use 5002 so it doesn't conflict with any other apps on 5000/5001

app.use(cors());
app.use(express.json());

// Serve static files for image uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
