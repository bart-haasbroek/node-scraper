const TweakersProduct = require('./TweakersProduct');
const WelkoopProduct = require('./WelkoopProduct');
const Product = require('./Product');

class ProductCreator {
    classMap = {
        tweakers: TweakersProduct,
        welkoop: WelkoopProduct,
    };

    constructor(url) {
        const product = this.buildProduct(url);
        return new product(url);
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

module.exports = ProductCreator;