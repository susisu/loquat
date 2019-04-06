"use strict";

const { expect } = require("chai");

const { makeAnchoredRegexp } = _char._internal;

describe("makeAnchoredRegexp", () => {
  it("should remove flags exept `i`, `m` and `u`", () => {
    const re = /foo/imugy;
    const anchored = makeAnchoredRegexp(re);
    expect(anchored.flags).to.contain("i");
    expect(anchored.flags).to.contain("m");
    expect(anchored.flags).to.contain("u");
    expect(anchored.flags).to.not.contain("y");
  });

  it("should create a regexp that matches the head of a string", () => {
    const re = /foo/;
    const anchored = makeAnchoredRegexp(re);
    expect(anchored.test("foobar")).to.be.true;
    expect(anchored.test("barfoo")).to.be.false;
  });

  it("should not change the group id of the argument regular expression", () => {
    const re = /(.)(.)/;
    const anchored = makeAnchoredRegexp(re);
    const match = anchored.exec("abc");
    expect(match).to.deep.equal(["ab", "a", "b"]);
  });
});
