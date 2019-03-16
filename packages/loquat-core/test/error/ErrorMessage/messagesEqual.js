"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage } = _error;

describe(".messagesEqual", () => {
  it("should return `true` if two arrays of error messages are equal", () => {
    const msgsA = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const msgsB = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.true;
  });

  it("should return `false` if two arrays of error messages are different", () => {
    // different messages
    {
      const msgsA = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
      ];
      const msgsB = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "ABC"),
      ];
      expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.false;
    }
    // lacks some messages
    {
      const msgsA = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
      ];
      const msgsB = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      ];
      expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.false;
    }
    // differently ordered
    {
      const msgsA = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
      ];
      const msgsB = [
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ];
      expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.false;
    }
  });
});
