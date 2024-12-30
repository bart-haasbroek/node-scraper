const TweakersProduct = require('./TweakersProduct');
const WelkoopProduct = require('./WelkoopProduct');
const BolProduct = require('./BolProduct');
const NintendoProduct = require('./NintendoProduct');

class ProductCreator {
    classMap = {
        bol: BolProduct,
        tweakers: TweakersProduct,
        welkoop: WelkoopProduct,
        nintendo: NintendoProduct,
    };

    static create(url) {
        const creator = new ProductCreator();
        const productKey = creator.getProductKeyFromUrl(url);

        const product = creator.classMap[productKey] ?? null;

        if (!product) {
            return null;
        }

        return new product(url);
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