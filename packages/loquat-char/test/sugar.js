/*
 * loquat-char test / sugar
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai   = require("chai");
const expect = chai.expect;

const Parser       = _core.Parser;
const assertParser = _core.assertParser;

describe("sugar", () => {
    it("should contain parser extension methods", () => {
        expect(_sugar.manyChars).to.be.a("function");
        assertParser(_sugar.manyChars.call(
            new Parser(() => {})
        ));

        expect(_sugar.manyChars1).to.be.a("function");
        assertParser(_sugar.manyChars1.call(
            new Parser(() => {})
        ));
    });
});
