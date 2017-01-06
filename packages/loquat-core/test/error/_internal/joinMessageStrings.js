/*
 * loquat-core test / error._internal.joinMessageStrings()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const joinMessageStrings = _error._internal.joinMessageStrings;

describe(".joinMessageStrings(msgStrs, desc = \"\")", () => {
    it("should return joined string of `msgStrs' with commas and \"or\" if `desc' is empty string", () => {
        const msgStrs = ["foo", "bar", "baz", "nyan", "cat"];
        // use default argument
        expect(joinMessageStrings(msgStrs)).to.equal("foo, bar, baz, nyan or cat");
        // specify desc explicityly
        expect(joinMessageStrings(msgStrs, "")).to.equal("foo, bar, baz, nyan or cat");
    });

    it("should return joined string of `msgStrs' with `desc' added to the head if `desc' is not empty", () => {
        const msgStrs = ["foo", "bar", "baz", "nyan", "cat"];
        expect(joinMessageStrings(msgStrs, "expected")).to.equal("expected foo, bar, baz, nyan or cat");
    });
});
