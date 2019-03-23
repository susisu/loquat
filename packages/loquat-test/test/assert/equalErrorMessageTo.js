"use strict";

const { expect, AssertionError } = require("chai");

const { ErrorMessageType, ErrorMessage } = _core;

describe("equalErrorMessageTo", () => {
  it("should throw AssertionError if the actual message is not equal to the expected one", () => {
    // type
    expect(() => {
      expect(ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"))
        .to.be.an.equalErrorMessageTo(ErrorMessage.create(ErrorMessageType.EXPECT, "foo"));
    }).to.throw(AssertionError);
    // str
    expect(() => {
      expect(ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"))
        .to.be.an.equalErrorMessageTo(ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"));
    }).to.throw(AssertionError);
    // both
    expect(() => {
      expect(ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"))
        .to.be.an.equalErrorMessageTo(ErrorMessage.create(ErrorMessageType.EXPECT, "bar"));
    }).to.throw(AssertionError);
  });

  it("should not throw AssertionError if the actual message is equal to the expected one", () => {
    expect(() => {
      expect(ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"))
        .to.be.an.equalErrorMessageTo(ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"));
    }).to.not.throw(AssertionError);
  });
});
