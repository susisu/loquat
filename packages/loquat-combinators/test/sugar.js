/*
 * loquat-combinators test / sugar
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai   = require("chai");
const expect = chai.expect;

const Parser       = _core.Parser;
const assertParser = _core.assertParser;

describe("sugar", () => {
    it("should contain parser extension methods", () => {
        expect(_sugar.option).to.be.a("function");
        assertParser(_sugar.option.call(
            new Parser(() => {}),
            "nyancat"
        ));

        expect(_sugar.optionMaybe).to.be.a("function");
        assertParser(_sugar.optionMaybe.call(
            new Parser(() => {})
        ));

        expect(_sugar.optional).to.be.a("function");
        assertParser(_sugar.optional.call(
            new Parser(() => {})
        ));

        expect(_sugar.between).to.be.a("function");
        assertParser(_sugar.between.call(
            new Parser(() => {}),
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.many1).to.be.a("function");
        assertParser(_sugar.many1.call(
            new Parser(() => {})
        ));

        expect(_sugar.skipMany1).to.be.a("function");
        assertParser(_sugar.skipMany1.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));
        assertParser(_sugar.skipMany1.call(
            new Parser(() => {})
        ));

        expect(_sugar.sepBy).to.be.a("function");
        assertParser(_sugar.sepBy.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.sepBy1).to.be.a("function");
        assertParser(_sugar.sepBy1.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.sepEndBy).to.be.a("function");
        assertParser(_sugar.sepEndBy.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.sepEndBy1).to.be.a("function");
        assertParser(_sugar.sepEndBy1.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.endBy).to.be.a("function");
        assertParser(_sugar.endBy.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.endBy1).to.be.a("function");
        assertParser(_sugar.endBy1.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.count).to.be.a("function");
        assertParser(_sugar.count.call(
            new Parser(() => {}),
            42
        ));

        expect(_sugar.notFollowedBy).to.be.a("function");
        assertParser(_sugar.notFollowedBy.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));
        assertParser(_sugar.notFollowedBy.call(
            new Parser(() => {})
        ));

        expect(_sugar.reduceManyTill).to.be.a("function");
        assertParser(_sugar.reduceManyTill.call(
            new Parser(() => {}),
            new Parser(() => {}),
            () => {},
            "nyancat"
        ));

        expect(_sugar.manyTill).to.be.a("function");
        assertParser(_sugar.manyTill.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.skipManyTill).to.be.a("function");
        assertParser(_sugar.skipManyTill.call(
            new Parser(() => {}),
            new Parser(() => {}),
            new Parser(() => {})
        ));
        assertParser(_sugar.skipManyTill.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));
    });
});
