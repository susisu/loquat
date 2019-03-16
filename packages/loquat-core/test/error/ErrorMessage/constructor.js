"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage } = _error;

describe(".constructor", () => {
  it("should create a new `ErrorMessage` instance", () => {
    const types = [
      ErrorMessageType.SYSTEM_UNEXPECT,
      ErrorMessageType.UNEXPECT,
      ErrorMessageType.EXPECT,
      ErrorMessageType.MESSAGE,
    ];
    for (const type of types) {
      expect(type).to.be.a("string"); // assert type exists
      const msg = new ErrorMessage(type, "foo");
      expect(msg).to.be.an.instanceOf(ErrorMessage);
      expect(msg.type).to.equal(type);
      expect(msg.msgStr).to.equal("foo");
    }
  });
});
