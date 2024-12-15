const Product = require('./Product');

class BolProduct extends Product {
    constructor(url) {
        super(url);
    }

    async getPrice(requestUrl) {
        try {
            const response = await this.getHtmlString();
            const regex = /<span[^>]*class="[^"]*product-prices__bol-price[^"]*"[^>]*>(\d{1,3},\d{2})<\/span>/;
            const match = response.match(regex);
            let price = '';

            if (match) {
                price = match[1];
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
            key: "bol",
            name: productName,
            price,
            url,
            requestUrl,
        };
    }
}

module.exports = BolProduct;