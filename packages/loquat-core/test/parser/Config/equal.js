/*
 * loquat-core test / parser.Config.equal()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _parser = require("parser.js");
const Config = _parser.Config;

describe(".equal(configA, configB)", () => {
    it("should return `true' if two configs are equal", () => {
        let configA = new Config({ tabWidth: 4, unicode: true });
        let configB = new Config({ tabWidth: 4, unicode: true });
        expect(Config.equal(configA, configB)).to.be.true;
    });

    it("should return `false' if two configs are different", () => {
        // different tabWidth
        {
            let configA = new Config({ tabWidth: 8, unicode: true });
            let configB = new Config({ tabWidth: 4, unicode: true });
            expect(Config.equal(configA, configB)).to.be.false;
        }
        // different unicode
        {
            let configA = new Config({ tabWidth: 4, unicode: false });
            let configB = new Config({ tabWidth: 4, unicode: true });
            expect(Config.equal(configA, configB)).to.be.false;
        }
        // both
        {
            let configA = new Config({ tabWidth: 8, unicode: false });
            let configB = new Config({ tabWidth: 4, unicode: true });
            expect(Config.equal(configA, configB)).to.be.false;
        }
    });
});
