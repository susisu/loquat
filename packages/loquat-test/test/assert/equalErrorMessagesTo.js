"use strict";

const { expect, AssertionError } = require("chai");

const { ErrorMessageType, ErrorMessage } = _core;

describe("equalErrorMessagesTo", () => {
  it("should throw AssertionError if the actual message array is not equal to the expected"
    + " one", () => {
    // type
    expect(() => {
      const act = [
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "bar"),
      ];
      const exp = [
        ErrorMessage.create(ErrorMessageType.EXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "bar"),
      ];
      expect(act).to.be.an.equalErrorMessagesTo(exp);
    }).to.throw(AssertionError);
    // str
    expect(() => {
      const act = [
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "bar"),
      ];
      const exp = [
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "bar"),
      ];
      expect(act).to.be.an.equalErrorMessagesTo(exp);
    }).to.throw(AssertionError);
    // both
    expect(() => {
      const act = [
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "bar"),
      ];
      const exp = [
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
      ];
      expect(act).to.be.an.equalErrorMessagesTo(exp);
    }).to.throw(AssertionError);
    // length
    expect(() => {
      const act = [
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "bar"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ];
      const exp = [
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "bar"),
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
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "bar"),
      ];
      const exp = [
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "bar"),
      ];
      expect(act).to.be.an.equalErrorMessagesTo(exp);
    }).to.not.throw(AssertionError);
  });
});
