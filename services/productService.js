
const productModel = require('../models/productModel');
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

    const product = new ProductCreator(url);
    const data = await product.getProductData();

    const lastChecked = new Date().toISOString();
    const priceHistory = JSON.stringify([{ price: data.price, date: lastChecked }]);
    const newProduct = [data.key, data.name = '', data.price, data.price, priceHistory, data.url, data.requestUrl, lastChecked];

    return productModel.createProduct(newProduct);
}

const priceDrops = async () => {
    try {
        const products = await productModel.getProducts();
        const drops = await Promise.all(
            products.map(async (row) => {
                const product = new ProductCreator(row.url);
                const newProductPrice = await product.getPrice(row.requestUrl);

                // Controleer of de prijs is gedaald
                if (newProductPrice < row.initialPrice) {
                    console.log('Price drop detected!!:', newProductPrice, row.initialPrice);
                    const priceHistory = JSON.parse(row.priceHistory);
                    const lastChecked = new Date().toISOString();
                    const newhistory = [...priceHistory, { price: newProductPrice, date: lastChecked }];
                    await productModel.updateProduct(row.id, { newhistory, newProductPrice, lastChecked });
                    return row;
                }

                return null; // Return null als er geen prijsdaling is
            })
        ).then((result) => result.filter((row) => row !== null)); // Filter de null-waarden
        return drops;
    } catch (error) {
        throw new Error('Failed to fetch price drops: ' + error.message);
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    priceDrops
};

