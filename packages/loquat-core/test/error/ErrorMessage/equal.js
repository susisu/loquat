"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage } = _error;

describe(".equal", () => {
  it("should return `true` if two error messages are equal", () => {
    const msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foo");
    const msgB = new ErrorMessage(ErrorMessageType.UNEXPECT, "foo");
    expect(ErrorMessage.equal(msgA, msgB)).to.be.true;
  });

  it("should return `false` if two error messagesa are different", () => {
    // different types
    {
      const msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foo");
      const msgB = new ErrorMessage(ErrorMessageType.EXPECT, "foo");
      expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
    }
    // different message strings
    {
      const msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foo");
      const msgB = new ErrorMessage(ErrorMessageType.UNEXPECT, "bar");
      expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
    }
    // both
    {
      const msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foo");
      const msgB = new ErrorMessage(ErrorMessageType.EXPECT, "bar");
      expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
    }
  });
});
