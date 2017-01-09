/*
 * loquat-core test / parser.Config.equal()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const Config = _parser.Config;

describe(".equal(configA, configB)", () => {
    it("should return `true' if two configs are equal", () => {
        const configA = new Config({ tabWidth: 4, unicode: true });
        const configB = new Config({ tabWidth: 4, unicode: true });
        expect(Config.equal(configA, configB)).to.be.true;
    });

    it("should return `false' if two configs are different", () => {
        // different tabWidth
        {
            const configA = new Config({ tabWidth: 8, unicode: true });
            const configB = new Config({ tabWidth: 4, unicode: true });
            expect(Config.equal(configA, configB)).to.be.false;
        }
        // different unicode
        {
            const configA = new Config({ tabWidth: 4, unicode: false });
            const configB = new Config({ tabWidth: 4, unicode: true });
            expect(Config.equal(configA, configB)).to.be.false;
        }
        // both
        {
            const configA = new Config({ tabWidth: 8, unicode: false });
            const configB = new Config({ tabWidth: 4, unicode: true });
            expect(Config.equal(configA, configB)).to.be.false;
        }
    });
});
