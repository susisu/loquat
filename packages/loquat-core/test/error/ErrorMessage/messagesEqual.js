"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage } = _error;

describe("ErrorMessage.messagesEqual", () => {
  it("should return true if two arrays of messaages are equal", () => {
    const msgsA = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    const msgsB = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.true;
    expect(ErrorMessage.messagesEqual(msgsB, msgsA)).to.be.true;
  });

  it("should return false if two arrays of messages are different", () => {
    // different messages
    {
      const msgsA = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
      ];
      const msgsB = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "y"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "z"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "w"),
      ];
      expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.false;
      expect(ErrorMessage.messagesEqual(msgsB, msgsA)).to.be.false;
    }
    // different length
    {
      const msgsA = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
      ];
      const msgsB = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ];
      expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.false;
      expect(ErrorMessage.messagesEqual(msgsB, msgsA)).to.be.false;
    }
    // differently ordered
    {
      const msgsA = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
      ];
      const msgsB = [
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ];
      expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.false;
      expect(ErrorMessage.messagesEqual(msgsB, msgsA)).to.be.false;
    }
  });
});
