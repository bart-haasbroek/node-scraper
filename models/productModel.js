const db = require('../database/db');

// Functie voor het ophalen van een product op basis van ID
const getProducts = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM products';
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else if (!rows) {
                reject('Products niet gevonden');
            } else {
                resolve(rows);
            }
        });
    });
};

// Functie voor het toevoegen van een product
const createProduct = (product) => {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO products (key, name, initialPrice, currentPrice, priceHistory, url, requestUrl, lastChecked)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        db.run(query, product, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(product);
            }
        });
    });
};

const updateProduct = (productId, product) => {
    return new Promise((resolve, reject) => {
        const { newProductPrice, newhistory, lastChecked } = product;
        const query = `
            UPDATE products
            SET priceHistory = ?, currentPrice = ?, lastChecked = ?
            WHERE id = ?
        `;
        const values = [JSON.stringify(newhistory), newProductPrice, lastChecked, productId];
        db.run(query, values, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(product);
            }
        });
    });
};

module.exports = { getProducts, createProduct, updateProduct };