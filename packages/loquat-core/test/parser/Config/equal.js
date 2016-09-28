/*
 * loquat-core test / parser.Config.equal()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { Config } = require("parser.js");

describe(".equal(configA, configB)", () => {
    it("should return `true' if two configs are equal", () => {
        let configA = new Config({ tabWidth: 4, useCodePoint: true });
        let configB = new Config({ tabWidth: 4, useCodePoint: true });
        expect(Config.equal(configA, configB)).to.be.true;
    });

    it("should return `false' if two configs are different", () => {
        // different tabWidth
        {
            let configA = new Config({ tabWidth: 8, useCodePoint: true });
            let configB = new Config({ tabWidth: 4, useCodePoint: true });
            expect(Config.equal(configA, configB)).to.be.false;
        }
        // different useCodePoint
        {
            let configA = new Config({ tabWidth: 4, useCodePoint: false });
            let configB = new Config({ tabWidth: 4, useCodePoint: true });
            expect(Config.equal(configA, configB)).to.be.false;
        }
        // both
        {
            let configA = new Config({ tabWidth: 8, useCodePoint: false });
            let configB = new Config({ tabWidth: 4, useCodePoint: true });
            expect(Config.equal(configA, configB)).to.be.false;
        }
    });
});
