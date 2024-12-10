const express = require('express');
const fetch = require('node-fetch');
const sqlite3 = require('sqlite3').verbose();

const ProductCreator = require('./products/ProductCreator');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});


db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    name TEXT NOT NULL,
    initialPrice REAL NOT NULL,
    currentPrice REAL NOT NULL,
    priceHistory TEXT NOT NULL,
    url TEXT NOT NULL,
    requestUrl TEXT NOT NULL,
    lastChecked TEXT NOT NULL
)`);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/add-product', async (req, res) => {
    console.log('req.body', req.body);

    const { url } = req.body;
    // let url = 'https://tweakers.net/pricewatch/2110590/apple-iphone-16-pro-512gb-opslag-zwart.html';
    // let url = 'https://www.welkoop.nl/bf-petfood-lam-rijst-hondenvoer-rijst-12-5kg_1221465';
    // let url = 'https://tweakers.net/pricewatch/1978140/apple-iphone-15-128gb-opslag-zwart.html';

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    try {
        const product = new ProductCreator(url);
        const data = await product.getProductData();

        const query = `
            INSERT INTO products (key, name, initialPrice, currentPrice, priceHistory, url, requestUrl, lastChecked)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const lastChecked = new Date().toISOString();
        const priceHistory = JSON.stringify([{ price: data.price, date: lastChecked }]);
        const values = [data.key, data.name = '', data.price, data.price, priceHistory, data.url, data.requestUrl, lastChecked];
        console.log('values', values);

        db.run(query, values, function (err) {
            if (err) {
                return res.status(500).send({ error: 'Failed to save data', details: err.message });
            }
            res.send({ message: 'Product added successfully', id: this.lastID });
        });
        // res.send(data);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch product data', details: error.message });
    }
});

app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Failed to retrieve products:', err.message);
            return res.status(500).send({ error: 'Failed to retrieve products', details: err.message });
        }
        console.log('rows', rows);
        res.json(rows);
    });
});

app.get('/pricedrops', async (req, res) => {
    try {
        const query = 'SELECT * FROM products';

        // Haal producten op uit de database
        const rows = await new Promise((resolve, reject) => {
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(new Error('Failed to retrieve products: ' + err.message));
                } else {
                    resolve(rows);
                }
            });
        });

        // Gebruik Promise.all om alle asynchrone bewerkingen in parallel uit te voeren
        const drops = await Promise.all(
            rows.map(async (row) => {
                const product = new ProductCreator(row.url);
                const newProductPrice = await product.getPrice(row.requestUrl);

                // Controleer of de prijs is gedaald
                if (newProductPrice < row.initialPrice) {
                    console.log('Price drop detected:', newProductPrice, row.initialPrice);
                    await updateProductPrice(row, newProductPrice);
                    return row; // Return de row als er een prijsdaling is
                }

                return null; // Return null als er geen prijsdaling is
            })
        ).then((result) => result.filter((row) => row !== null)); // Filter de null-waarden
        res.json(drops);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send({ error: 'Failed to process price drops', details: err.message });
    }
});

const updateProductPrice = (dbProduct, newProductPrice) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE products
            SET priceHistory = ?, currentPrice = ?, lastChecked = ?
            WHERE id = ?
        `;

        const lastChecked = new Date().toISOString();
        const priceHistory = JSON.parse(dbProduct.priceHistory);
        const newhistory = [...priceHistory, { price: newProductPrice, date: lastChecked }];

        const values = [JSON.stringify(newhistory), newProductPrice, lastChecked, dbProduct.id];

        db.run(query, values, function (err) {
            if (err) {
                reject(new Error('Failed to update product price: ' + err.message));
            } else {
                console.log(`Product with ID ${dbProduct.id} updated with new price: ${newProductPrice}`);
                resolve();
            }
        });
    });
};

// Start de server
app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});