const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

router.get('/products', async (req, res) => {
    const products = await productService.getAllProducts();
    try {
        res.json(products);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch products', details: error.message });
    }
});

router.post('/add-product', async (req, res) => {
    const { url } = req.body;
    try {
        const product = await productService.createProduct(url);
        res.json(product);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch products', details: error.message });
    }
});

router.post('/price-drops', async (req, res) => {
    const product = await productService.priceDrops();
    try {
        res.json(product);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch pricedrops', details: error.message });
    }
});

module.exports = router;