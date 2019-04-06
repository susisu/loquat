"use strict";

const { expect } = require("chai");

describe("core", () => {
  it("should have exports all defined", () => {
    for (const key of Object.keys($core)) {
      expect($core).to.not.have.property(key, undefined);
    }
  });
});
