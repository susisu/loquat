"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage } = _error;

describe("messagesToString", () => {
  it("should return \"unknown parse error\" if the argument is empty", () => {
    expect(ErrorMessage.messagesToString([])).to.equal("unknown parse error");
  });

  it("should pretty-print the given error messages", () => {
    // only SYSTEM_UNEXPECT
    {
      const msgs = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
      ];
      const text = "unexpected end of input";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    {
      const msgs = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysC"),
      ];
      const text = "unexpected sysA";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    // only UNEXPECT
    {
      const msgs = [
        new ErrorMessage(ErrorMessageType.UNEXPECT, "unexpA"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "unexpB"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "unexpC"),
      ];
      const text = "unexpected unexpA, unexpB or unexpC";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    // only EXPECT
    {
      const msgs = [
        new ErrorMessage(ErrorMessageType.EXPECT, "expA"),
        new ErrorMessage(ErrorMessageType.EXPECT, "expB"),
        new ErrorMessage(ErrorMessageType.EXPECT, "expC"),
      ];
      const text = "expecting expA, expB or expC";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    // only MESSAGE
    {
      const msgs = [
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgA"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgB"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgC"),
      ];
      const text = "msgA, msgB or msgC";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    // mixed
    {
      const msgs = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
        new ErrorMessage(ErrorMessageType.EXPECT, "expA"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgA"),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
        new ErrorMessage(ErrorMessageType.EXPECT, "expB"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgB"),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
        new ErrorMessage(ErrorMessageType.EXPECT, "expC"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgC"),
      ];
      const text = "unexpected end of input\n"
                + "expecting expA, expB or expC\n"
                + "msgA, msgB or msgC";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    {
      const msgs = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
        new ErrorMessage(ErrorMessageType.EXPECT, "expA"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgA"),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
        new ErrorMessage(ErrorMessageType.EXPECT, "expB"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgB"),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysC"),
        new ErrorMessage(ErrorMessageType.EXPECT, "expC"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgC"),
      ];
      const text = "unexpected sysA\n"
                + "expecting expA, expB or expC\n"
                + "msgA, msgB or msgC";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    {
      const msgs = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "unexpA"),
        new ErrorMessage(ErrorMessageType.EXPECT, "expA"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgA"),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "unexpB"),
        new ErrorMessage(ErrorMessageType.EXPECT, "expB"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgB"),
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysC"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "unexpC"),
        new ErrorMessage(ErrorMessageType.EXPECT, "expC"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "msgC"),
      ];
      const text = "unexpected unexpA, unexpB or unexpC\n"
                + "expecting expA, expB or expC\n"
                + "msgA, msgB or msgC";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
  });

  it("should throw `Error` if the argument contains any message with unknown type", () => {
    const msgs = [
      new ErrorMessage("unknown", "foo"),
    ];
    expect(() => { ErrorMessage.messagesToString(msgs); }).to.throw(Error, /unknown message type/i);
  });
});
