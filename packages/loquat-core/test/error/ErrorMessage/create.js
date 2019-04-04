"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage } = _error;

describe(".create", () => {
  it("should create a new ErrorMessage object", () => {
    const types = [
      ErrorMessageType.SYSTEM_UNEXPECT,
      ErrorMessageType.UNEXPECT,
      ErrorMessageType.EXPECT,
      ErrorMessageType.MESSAGE,
    ];
    for (const type of types) {
      expect(type).to.be.a("string"); // assert type exists
      const msg = ErrorMessage.create(type, "foo");
      expect(ErrorMessage.equal(msg, { type, str: "foo" })).to.be.true;
    }
  });
});
