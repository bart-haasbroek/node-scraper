const express = require('express');
const productRoutes = require('./routes/productRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(authMiddleware);

app.use('/api', productRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start de server
app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});