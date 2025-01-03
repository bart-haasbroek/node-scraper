
const productModel = require('../models/productModel');
const errorModel = require('../models/errorModel');
const ProductCreator = require('../products/ProductCreator');

const getAllProducts = async () => {
    try {
        const products = await productModel.getProducts();
        return products;
    } catch (error) {
        throw new Error('Failed to fetch products: ' + error.message);
    }
};

const createProduct = async (url) => {
    const products = await productModel.getProducts();

    if (products.some((row) => row.url === url)) {
        throw new Error('Product already exists');
    }

    const product = ProductCreator.create(url);
    if (!product) {
        throw new Error('Product not supported yet.');
    }

    const data = await product.getProductData();
    const lastChecked = new Date().toISOString();
    const priceHistory = JSON.stringify([{ price: data.price, date: lastChecked }]);
    const newProduct = [data.key, data.name, data.price, data.price, data.price, priceHistory, data.url, data.requestUrl, lastChecked];

    return productModel.createProduct(newProduct);
}

const deleteProduct = async (id) => {
    const deletedProduct = await productModel.deleteProduct(id);
    return deletedProduct;
}

const checkPrices = async () => {
    try {
        const products = await productModel.getProducts();
        await Promise.all(
            products.map(async (row) => {
                const product = ProductCreator.create(row.url);
                try {
                    const newProductPrice = await product.getPrice(row.requestUrl);
                    const lastChecked = new Date().toISOString();
                    const lastCheckedPrice = row.currentPrice;
                    const priceHistory = row.priceHistory ? JSON.parse(row.priceHistory) : [];
                    const newHistory = [...priceHistory, { price: newProductPrice, date: lastChecked }];
                    await productModel.updateProduct(row.id, {
                        newHistory,
                        newProductPrice,
                        lastCheckedPrice,
                        lastChecked,
                    });
                } catch (error) {
                    errorModel.createError({
                        key: row.key,
                        timestamp: new Date().toISOString(),
                        errorCode: 'Failed to check price',
                    });
                }
            })
        );
    } catch (error) {
        throw new Error('Failed to check prices: ' + error.message);
    }
}

const priceDrops = async () => {
    try {
        const products = await productModel.getProducts();

        const priceDrops = products.filter((row) => {
            return row.currentPrice < row.initialPrice || row.currentPrice < row.lastCheckedPrice;
        });

        const priceDropData = priceDrops.map((row) => {
            return {
                id: row.id,
                name: row.name,
                key: row.key,
                initialPrice: row.initialPrice,
                currentPrice: row.currentPrice,
                lastCheckedPrice: row.lastCheckedPrice,
                discountSinceLastPrice: Math.round(((row.currentPrice - row.lastCheckedPrice) / row.lastCheckedPrice) * 100),
                discountSinceInitialPrice: Math.round(((row.currentPrice - row.initialPrice) / row.initialPrice) * 100),
                url: row.url,
                priceHistory: JSON.parse(row.priceHistory),
            };
        });

        return priceDropData;
    } catch (error) {
        throw new Error('Failed to fetch price drops: ' + error.message);
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    deleteProduct,
    priceDrops,
    checkPrices
};

