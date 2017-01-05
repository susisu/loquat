/*
 * loquat-monad test / sugar
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai   = require("chai");
const expect = chai.expect;

const Parser       = _core.Parser;
const assertParser = _core.assertParser;

describe("sugar", () => {
    it("should contain parser extension methods", () => {
        expect(_sugar.forever).to.be.a("function");
        assertParser(_sugar.forever.call(
            new Parser(() => {})
        ));

        expect(_sugar.discard).to.be.a("function");
        assertParser(_sugar.discard.call(
            new Parser(() => {})
        ));

        expect(_sugar.void).to.be.a("function");
        assertParser(_sugar.void.call(
            new Parser(() => {})
        ));

        expect(_sugar.join).to.be.a("function");
        assertParser(_sugar.join.call(
            new Parser(() => {})
        ));

        expect(_sugar.when).to.be.a("function");
        assertParser(_sugar.when.call(
            new Parser(() => {}),
            true
        ));

        expect(_sugar.unless).to.be.a("function");
        assertParser(_sugar.unless.call(
            new Parser(() => {}),
            false
        ));

        expect(_sugar.filter).to.be.a("function");
        assertParser(_sugar.filter.call(
            new Parser(() => {}),
            () => {}
        ));
    });
});
