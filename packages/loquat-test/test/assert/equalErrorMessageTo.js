"use strict";

const { expect, AssertionError } = require("chai");

const { ErrorMessageType, ErrorMessage } = _core;

describe("equalErrorMessageTo", () => {
  it("should throw AssertionError if the actual message is not equal to the expected one", () => {
    // type
    expect(() => {
      const act = ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo");
      const exp = ErrorMessage.create(ErrorMessageType.EXPECT, "foo");
      expect(act).to.be.an.equalErrorMessageTo(exp);
    }).to.throw(AssertionError, /ErrorMessage/);
    // str
    expect(() => {
      const act = ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo");
      const exp = ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar");
      expect(act).to.be.an.equalErrorMessageTo(exp);
    }).to.throw(AssertionError, /ErrorMessage/);
    // both
    expect(() => {
      const act = ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo");
      const exp = ErrorMessage.create(ErrorMessageType.EXPECT, "bar");
      expect(act).to.be.an.equalErrorMessageTo(exp);
    }).to.throw(AssertionError, /ErrorMessage/);
  });

  it("should not throw AssertionError if the actual message is equal to the expected one", () => {
    expect(() => {
      const act = ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo");
      const exp = ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo");
      expect(act).to.be.an.equalErrorMessageTo(exp);
    }).to.not.throw(AssertionError);
  });
});
