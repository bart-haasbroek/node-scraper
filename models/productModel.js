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

const createProduct = (product) => {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO products (key, name, initialPrice, currentPrice, lastCheckedPrice, priceHistory, url, requestUrl, lastChecked)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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

const deleteProduct = (productId) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM products WHERE id = ?`;

        db.run(query, [productId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(`Product with ID ${productId} deleted successfully.`);
            }
        });
    });
};

const updateProduct = (productId, product) => {
    return new Promise((resolve, reject) => {
        const { newProductPrice, newHistory, lastChecked, lastCheckedPrice } = product;

        const query = `
            UPDATE products
            SET priceHistory = ?, currentPrice = ?, lastCheckedPrice = ?, lastChecked = ?
            WHERE id = ?
        `;
        const values = [JSON.stringify(newHistory), newProductPrice, lastCheckedPrice, lastChecked, productId];
        db.run(query, values, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(product);
            }
        });
    });
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };