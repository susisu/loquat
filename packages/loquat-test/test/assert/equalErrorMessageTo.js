"use strict";

const { expect, AssertionError } = require("chai");

const { ErrorMessageType, ErrorMessage } = _core;

describe("equalErrorMessageTo", () => {
  it("should throw AssertionError if the actual message is not equal to the expected one", () => {
    // type
    expect(() => {
      expect(new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"))
        .to.be.an.equalErrorMessageTo(new ErrorMessage(ErrorMessageType.EXPECT, "foo"));
    }).to.throw(AssertionError);
    // msgStr
    expect(() => {
      expect(new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"))
        .to.be.an.equalErrorMessageTo(new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"));
    }).to.throw(AssertionError);
    // both
    expect(() => {
      expect(new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"))
        .to.be.an.equalErrorMessageTo(new ErrorMessage(ErrorMessageType.EXPECT, "bar"));
    }).to.throw(AssertionError);
  });

  it("should not throw AssertionError if the actual message is equal to the expected one", () => {
    expect(() => {
      expect(new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"))
        .to.be.an.equalErrorMessageTo(new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"));
    }).to.not.throw(AssertionError);
  });

  it("should throw AssertionError if the object is not an `ErrorMessage` instance", () => {
    expect(() => {
      expect({})
        .to.be.an.equalErrorMessageTo(new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"));
    }).to.throw(AssertionError);
    expect(() => {
      expect({})
        .to.not.be.an.equalErrorMessageTo(new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"));
    }).to.throw(AssertionError);
  });
});
