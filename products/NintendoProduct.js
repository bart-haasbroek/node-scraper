const Product = require('./Product');
const fetch = require('node-fetch');

class NintendoProduct extends Product {
    constructor(url) {
        super(url);
    }

    async getPrice(requestUrl) {
        try {
            const response = await fetch(requestUrl);
            const priceDataResponse = await response.json();
            const prices = priceDataResponse.prices[0];
            const discountPriceKey = !!prices['discount_price'] ? 'discount_price' : 'regular_price';
            const priceValue = prices[discountPriceKey].raw_value;
            return priceValue;
        }
        catch (error) {
            console.error('error nintendo eshop price', error);
        }
    }

    async getRequestUrl() {
        const htmlString = await this.getHtmlString();
        const match = htmlString.match(/const na_nsuid = \["(\d+)"\]/);

        if (match && match[1]) {
            const id = match[1];
            return `https://api.ec.nintendo.com/v1/price?country=NL&lang=nl&ids=${id}`;
        } else {
            console.log("ID niet gevonden");
        }
    }

    async getProductName() {
        const htmlString = await this.getHtmlString();
        const match = htmlString.match(/"gameTitle":\s*"([^"]+)"/);
        if (match && match[1]) {
            const gameTitle = match[1];
            return gameTitle;
        } else {
            console.log("gameTitle niet gevonden");
        }
    }

    async getProductData() {
        const productName = await this.getProductName();
        const url = this.url;
        const requestUrl = await this.getRequestUrl(url);
        const price = await this.getPrice(requestUrl);

        return {
            key: "nintendo",
            name: productName,
            price,
            url,
            requestUrl,
        };
    }
}

module.exports = NintendoProduct;