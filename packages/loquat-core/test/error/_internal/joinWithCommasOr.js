/*
 * loquat test / error._internal.joinWithCommasOr()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { _internal: { joinWithCommasOr } } = require("error.js");

describe(".joinWithCommasOr(msgStrs)", () => {
    it("should return empty string if `msgStrs' is empty", () => {
        expect(joinWithCommasOr([])).to.equal("");
    });

    it("should return the first element if `msgStrs' has only one element", () => {
        expect(joinWithCommasOr(["foobar"])).to.equal("foobar");
    });

    it("should return string like \"A or B\" if `msgStrs' has two elements", () => {
        expect(joinWithCommasOr(["foobar", "nyancat"])).to.equal("foobar or nyancat");
    });

    it("should joined string of the initial elements separated by commas (,),"
        + " with the last element joined with \"or\"", () => {
        let msgStrs = ["foo", "bar", "baz", "nyan", "cat"];
        expect(joinWithCommasOr(msgStrs)).to.equal("foo, bar, baz, nyan or cat");
    });
});
