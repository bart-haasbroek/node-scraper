const fetch = require('node-fetch');

class Product {
    htmlString;
    apiData;
    constructor(url) {
        this.url = url;
    }

    getRequestUrl(url) {
        return url;
    }

    getProductName() {
        return "";
    }

    async getApiData(url) {
        if (this.apiData) {
            return this.apiData;
        }
        const response = await fetch(url);
        const data = await response.json();
        this.apiData = data;
        return data;
    }

    async getHtmlString(fresh = false) {
        if (this.htmlString && !fresh) {
            return this.htmlString;
        }
        try {
            const response = await fetch(this.url);

            if (!response.ok) {
                throw new Error('Netwerk antwoord was niet ok');
            }

            const htmlString = await response.text();
            this.htmlString = htmlString;
            return htmlString;

        } catch (error) {
            console.error('Er is een fout opgetreden:', error);
        }
    }

    formatPrice(price) {
        let priceString = price.toString();
        priceString = priceString.replace(",", ".");
        let formattedPrice = parseFloat(priceString).toFixed(2);
        return formattedPrice;
    }
}

module.exports = Product;