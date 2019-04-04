"use strict";

const { expect } = require("chai");

const { Config } = _parser;

describe("#setUnicode", () => {
  it("should create a copy of the config with `unicode` updated", () => {
    const config  = new Config({ tabWidth: 8, unicode: false });
    const copy = config.setUnicode(true);
    expect(copy).to.not.equal(config);
    expect(Config.equal(copy, new Config({ tabWidth: 8, unicode: true }))).to.be.true;
  });
});
