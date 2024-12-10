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

    async getHtmlString() {
        if (this.htmlString) {
            return this.htmlString;
        }
        try {
            const response = await fetch(this.url);

            // Controleer of de response succesvol is (status 200)
            if (!response.ok) {
                throw new Error('Netwerk antwoord was niet ok');
            }

            // Als de inhoud een HTML-string is, gebruik dan .text()
            const htmlString = await response.text();
            this.htmlString = htmlString;
            return htmlString; // of doe iets anders met de data

        } catch (error) {
            console.error('Er is een fout opgetreden:', error);
        }
    }
}

class ProductCreator {
    classMap = {
        tweakers: TweakersProduct,
    };

    constructor(url) {
        const product = this.buildProduct(url);
        return new Product(url);
    }

    buildProduct(url) {
        const productKey = this.getProductKeyFromUrl(url);
        return this.classMap[productKey] ?? null;
    }

    getProductKeyFromUrl(url) {
        const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/;
        const matches = url.match(domainRegex);

        if (matches && matches.length > 1) {
            const domainParts = matches[1].split(".");
            // check for subdomains
            const domainIndex = domainParts.length > 2 ? 1 : 0;
            const domain = domainParts[domainIndex];
            return domain;
        }
        return null;
    }
}

module.exports = Product;