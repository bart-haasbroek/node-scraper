const Product = require('./Product');
const fetch = require('node-fetch');

class WelkoopProduct extends Product {
    constructor(url) {
        super(url);
    }

    async getPrice(requestUrl) {
        const response = await this.getHtmlString();
        const regex = /<\s*span\s+class="price">(\d+)\.<sup>(\d+)<\/sup><\/span>/;
        const match = response.match(regex);
        let price = '';

        if (match) {
            price = `${match[1]}.${match[2]}`;
            console.log('Price:', price); // Output: Price: 53.95
        } else {
            console.error('Price not found!');
        }
        // get price insted of price dataset
        return price;
    }

    async getProductData() {
        const productName = await this.getProductName();
        const url = this.url;
        const requestUrl = this.getRequestUrl(url);
        const price = await this.getPrice(requestUrl);

        return {
            key: "welkoop",
            name: productName,
            price,
            url,
            requestUrl,
        };
    }
}

module.exports = WelkoopProduct;