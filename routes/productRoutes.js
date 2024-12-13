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
    if (!url) {
        res.status(500).send({ error: 'url is required' });
        return;
    }

    try {
        const product = await productService.createProduct(url);
        res.json(product);
    } catch (error) {
        res.status(500).send({ error: 'Failed to add product', details: error.message });
    }
});

router.post('/delete-product', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.status(500).send({ error: 'id is required' });
        return;
    }
    const products = await productService.getAllProducts();

    if (!products.some((row) => row.id === id)) {
        res.status(500).send({ error: 'product does not exist' });
        return;
    }

    try {
        const product = await productService.deleteProduct(id);
        res.json(product);
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete product', details: error.message });
    }
});

router.get('/price-drops', async (req, res) => {
    const product = await productService.priceDrops();
    try {
        res.json(product);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch pricedrops', details: error.message });
    }
});

router.get('/check-prices', async (req, res) => {
    await productService.checkPrices();
    try {
        res.send('Gelukt');
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch pricedrops', details: error.message });
    }
});

module.exports = router;