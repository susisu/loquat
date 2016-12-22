/*
 * loquat-core test / utils.unconsString()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const unconsString = _utils.unconsString;

describe(".unconsString(str, unicode)", () => {
    context("when `unicode' is true", () => {
        it("should return an object describing empty input if `str' is empty", () => {
            expect(unconsString("", true)).to.deep.equal({ empty: true });
        });

        it("should return an object containing head and tail if `str' is not non empty", () => {
            expect(unconsString("f", true)).to.deep.equal({ empty: false, head: "f", tail: "" });
            expect(unconsString("foobar", true)).to.deep.equal({ empty: false, head: "f", tail: "oobar" });

            expect(unconsString("\uD83C", true))
                .to.deep.equal({ empty: false, head: "\uD83C", tail: "" });
            expect(unconsString("\uD83Ccat", true))
                .to.deep.equal({ empty: false, head: "\uD83C", tail: "cat" });
            expect(unconsString("\uD83C\uDF63", true))
                .to.deep.equal({ empty: false, head: "\uD83C\uDF63", tail: "" });
            expect(unconsString("\uD83C\uDF63cat", true))
                .to.deep.equal({ empty: false, head: "\uD83C\uDF63", tail: "cat" });

            // boundary cases
            expect(unconsString("\uD7FF\uDC00cat", true))
                .to.deep.equal({ empty: false, head: "\uD7FF", tail: "\uDC00cat" });
            expect(unconsString("\uDC00\uDC00cat", true))
                .to.deep.equal({ empty: false, head: "\uDC00", tail: "\uDC00cat" });
            expect(unconsString("\uD800\uDBFFcat", true))
                .to.deep.equal({ empty: false, head: "\uD800", tail: "\uDBFFcat" });
            expect(unconsString("\uD800\uE000cat", true))
                .to.deep.equal({ empty: false, head: "\uD800", tail: "\uE000cat" });
            expect(unconsString("\uD800\uDC00cat", true))
                .to.deep.equal({ empty: false, head: "\uD800\uDC00", tail: "cat" });
            expect(unconsString("\uDBFF\uDFFFcat", true))
                .to.deep.equal({ empty: false, head: "\uDBFF\uDFFF", tail: "cat" });
        });
    });

    context("when `unicode' is false", () => {
        it("should return an object describing empty input if `str' is empty", () => {
            expect(unconsString("", false)).to.deep.equal({ empty: true });
        });

        it("should return an object containing head and tail if `str' is not non empty", () => {
            expect(unconsString("f", false)).to.deep.equal({ empty: false, head: "f", tail: "" });
            expect(unconsString("foobar", false)).to.deep.equal({ empty: false, head: "f", tail: "oobar" });
        });
    });
});
