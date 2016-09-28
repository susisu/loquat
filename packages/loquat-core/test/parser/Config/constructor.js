/*
 * loquat-core test / parser.Config constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _parser = require("parser.js");
const Config = _parser.Config;

describe("constructor(opts = {})", () => {
    it("should create a new `Config' instance", () => {
        // use default argument
        {
            let config = new Config();
            expect(config).to.be.an.instanceOf(Config);
            expect(config.tabWidth).to.equal(8);
            expect(config.useCodePoint).to.equal(false);
        }
        // use default config
        {
            let config = new Config({});
            expect(config).to.be.an.instanceOf(Config);
            expect(config.tabWidth).to.equal(8);
            expect(config.useCodePoint).to.equal(false);
        }
        // specify config
        {
            let config = new Config({
                tabWidth    : 4,
                useCodePoint: true
            });
            expect(config).to.be.an.instanceOf(Config);
            expect(config.tabWidth).to.equal(4);
            expect(config.useCodePoint).to.equal(true);
        }
    });
});
