const Product = require('./Product');
const fetch = require('node-fetch');

class TweakersProduct extends Product {
    constructor(url) {
        super(url);
    }

    async getPrice(requestUrl) {
        try {
            const response = await fetch(requestUrl);
            const priceDataResponse = await response.json();
            const priceDataSource = priceDataResponse.dataset.source.pop();
            const [date, price, averagePrice] = priceDataSource;
            return price;
        }
        catch (error) {
            console.error('error tweakers price', error);
        }
    }

    async getProductName() {
        const response = await this.getHtmlString();

        const regex = /<h1[^>]*>(?:<a[^>]*>)?([^<]+)(?:<\/a>)?\s*<\/h1>/;
        const match = response.match(regex);
        if (match) {
            const title = match[1];
            return decode(title);
        } else {
            return "";
        }

        function decode(str) {
            log(str);
            let regex = /&#(\d+);/g;
            return str.replace(regex, (match, dec) => {
                return String.fromCharCode(dec);
            });
        }
    }

    getRequestUrl(url) {
        const regex = /pricewatch\/(\d+)\//;
        const matches = url.match(regex);

        if (matches && matches.length > 1) {
            var id = matches[1];
            return `https://tweakers.net/ajax/price_chart/${id}/nl/`;
        }

        return "";
    }

    async getProductData() {
        const productName = await this.getProductName();
        const url = this.url;
        const requestUrl = this.getRequestUrl(url);
        const price = await this.getPrice(requestUrl);

        return {
            key: "tweakers",
            name: productName,
            price,
            url,
            requestUrl,
        };
    }
}

module.exports = TweakersProduct;