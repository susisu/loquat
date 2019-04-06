"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage } = _error;

describe(".equall", () => {
  it("should return true if two messages are equal", () => {
    const msgA = ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo");
    const msgB = ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo");
    expect(ErrorMessage.equal(msgA, msgB)).to.be.true;
    expect(ErrorMessage.equal(msgB, msgA)).to.be.true;
  });

  it("should return false if two messages are different", () => {
    // different types
    {
      const msgA = ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo");
      const msgB = ErrorMessage.create(ErrorMessageType.EXPECT, "foo");
      expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
      expect(ErrorMessage.equal(msgB, msgA)).to.be.false;
    }
    // different message strings
    {
      const msgA = ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo");
      const msgB = ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar");
      expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
      expect(ErrorMessage.equal(msgB, msgA)).to.be.false;
    }
    // both
    {
      const msgA = ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo");
      const msgB = ErrorMessage.create(ErrorMessageType.EXPECT, "bar");
      expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
      expect(ErrorMessage.equal(msgB, msgA)).to.be.false;
    }
  });
});
