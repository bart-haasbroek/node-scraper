const fetch = require('node-fetch');

class Product {
    htmlString;
    constructor(url) {
        this.url = url;
    }

    getRequestUrl(url) {
        return url;
    }

    getProductName() {
        return "name";
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
}

module.exports = Product;