/*
 * loquat-core test / utils.unconsString()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const unconsString = _utils.unconsString;

describe(".unconsString(str, unicode)", () => {
    it("should return an object describing empty input if `str' is empty", () => {
        expect(unconsString("", false)).to.deep.equal({ empty: true });
        expect(unconsString("", true)).to.deep.equal({ empty: true });
    });

    it("should return an object containing head and tail if `str' is not non empty", () => {
        expect(unconsString("foobar", false)).to.deep.equal({ empty: false, head: "f", tail: "oobar" });
        expect(unconsString("foobar", true)).to.deep.equal({ empty: false, head: "f", tail: "oobar" });

        expect(unconsString("\uD83C\uDF63cat", false))
            .to.deep.equal({ empty: false, head: "\uD83C", tail: "\uDF63cat" });
        expect(unconsString("\uD83C\uDF63cat", true))
            .to.deep.equal({ empty: false, head: "\uD83C\uDF63", tail: "cat" });
    });
});
