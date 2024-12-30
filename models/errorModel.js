const db = require('../database/db');

const createError = (error) => {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO errors (key, timestamp, errorCode)
        VALUES (?, ?, ?)
    `;
        db.run(query, [error.key, error.timestamp, error.errorCode], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(error);
            }
        });
    });
};

module.exports = { createError };