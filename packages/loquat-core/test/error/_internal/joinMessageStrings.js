/*
 * loquat test / error._internal.joinMessageStrings()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { _internal: { joinMessageStrings } } = require("error.js");

describe(".joinMessageStrings(msgStrs, desc = \"\")", () => {
    it("should return joined string of `msgStrs' with commas and \"or\" if `desc' is empty string", () => {
        let msgStrs = ["foo", "bar", "baz", "nyan", "cat"];
        // use default argument
        expect(joinMessageStrings(msgStrs)).to.equal("foo, bar, baz, nyan or cat");
        // specify desc explicityly
        expect(joinMessageStrings(msgStrs, "")).to.equal("foo, bar, baz, nyan or cat");
    });

    it("should return joined string of `msgStrs' with `desc' added to the head if `desc' is not empty", () => {
        let msgStrs = ["foo", "bar", "baz", "nyan", "cat"];
        expect(joinMessageStrings(msgStrs, "expected")).to.equal("expected foo, bar, baz, nyan or cat");
    });
});
