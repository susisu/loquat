"use strict";

const { expect, AssertionError } = require("chai");

const { ErrorMessageType, ErrorMessage } = _core;

describe("equalErrorMessagesTo", () => {
  it("should throw AssertionError if the actual message array is not equal to the expected"
    + " one", () => {
    // type
    expect(() => {
      const act = [
        new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "bar"),
      ];
      const exp = [
        new ErrorMessage(ErrorMessageType.EXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "bar"),
      ];
      expect(act).to.be.an.equalErrorMessagesTo(exp);
    }).to.throw(AssertionError);
    // msgStr
    expect(() => {
      const act = [
        new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "bar"),
      ];
      const exp = [
        new ErrorMessage(ErrorMessageType.UNEXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "bar"),
      ];
      expect(act).to.be.an.equalErrorMessagesTo(exp);
    }).to.throw(AssertionError);
    // both
    expect(() => {
      const act = [
        new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "bar"),
      ];
      const exp = [
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
      ];
      expect(act).to.be.an.equalErrorMessagesTo(exp);
    }).to.throw(AssertionError);
    // length
    expect(() => {
      const act = [
        new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      ];
      const exp = [
        new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "bar"),
      ];
      expect(act).to.be.an.equalErrorMessagesTo(exp);
    }).to.throw(AssertionError);
  });

  it("should not throw AssertionError if the actual message array is equal to the expected"
    + " one", () => {
    expect(() => {
      expect([]).to.be.an.equalErrorMessagesTo([]);
    }).to.not.throw(AssertionError);

    expect(() => {
      const act = [
        new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "bar"),
      ];
      const exp = [
        new ErrorMessage(ErrorMessageType.UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "bar"),
      ];
      expect(act).to.be.an.equalErrorMessagesTo(exp);
    }).to.not.throw(AssertionError);
  });

  it("should throw AssertionError if any of the array elements is not an `ErrorMessage`"
    + " instance", () => {
    expect(() => {
      const act = [{}];
      const exp = [new ErrorMessage(ErrorMessageType.UNEXPECT, "foo")];
      expect(act).to.be.an.equalErrorMessagesTo(exp);
    }).to.throw(AssertionError);
    expect(() => {
      const act = [{}];
      const exp = [new ErrorMessage(ErrorMessageType.UNEXPECT, "foo")];
      expect(act).to.not.be.an.equalErrorMessagesTo(exp);
    }).to.throw(AssertionError);
  });
});
