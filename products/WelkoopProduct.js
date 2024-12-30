const Product = require('./Product');

class WelkoopProduct extends Product {
    constructor(url) {
        super(url);
    }

    async getPrice(requestUrl) {
        try {
            const response = await this.getHtmlString();
            const regex = /<\s*span\s+class="price">(\d+)\.<sup>(\d+)<\/sup><\/span>/;
            const match = response.match(regex);
            let price = '';

            if (match) {
                price = `${match[1]}.${match[2]}`;
                price = this.formatPrice(price);
            } else {
                console.error('Price not found!');
            }
            // get price insted of price dataset
            return price;
        } catch (error) {
            console.error('error welkoop price', error);
        }
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