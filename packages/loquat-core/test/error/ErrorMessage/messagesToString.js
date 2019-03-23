"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage } = _error;

describe(".messagesToString", () => {
  it("should return \"unknown parse error\" if the argument is empty", () => {
    expect(ErrorMessage.messagesToString([])).to.equal("unknown parse error");
  });

  it("should pretty-print the given error messages", () => {
    // only SYSTEM_UNEXPECT
    {
      const msgs = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
      ];
      const text = "unexpected end of input";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    {
      const msgs = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysC"),
      ];
      const text = "unexpected sysA";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    // only UNEXPECT
    {
      const msgs = [
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "unexpA"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "unexpB"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "unexpC"),
      ];
      const text = "unexpected unexpA, unexpB or unexpC";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    // only EXPECT
    {
      const msgs = [
        ErrorMessage.create(ErrorMessageType.EXPECT, "expA"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expB"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expC"),
      ];
      const text = "expecting expA, expB or expC";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    // only MESSAGE
    {
      const msgs = [
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgA"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgB"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgC"),
      ];
      const text = "msgA, msgB or msgC";
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    // mixed
    {
      const msgs = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expA"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgA"),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expB"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgB"),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expC"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgC"),
      ];
      const text = [
        "unexpected end of input",
        "expecting expA, expB or expC",
        "msgA, msgB or msgC",
      ].join("\n");
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    {
      const msgs = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expA"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgA"),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expB"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgB"),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysC"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expC"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgC"),
      ];
      const text = [
        "unexpected sysA",
        "expecting expA, expB or expC",
        "msgA, msgB or msgC",
      ].join("\n");
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
    {
      const msgs = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "unexpA"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expA"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgA"),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "unexpB"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expB"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgB"),
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "sysC"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "unexpC"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "expC"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "msgC"),
      ];
      const text = [
        "unexpected unexpA, unexpB or unexpC",
        "expecting expA, expB or expC",
        "msgA, msgB or msgC",
      ].join("\n");
      expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
    }
  });

  it("should throw `Error` if the argument contains any message with unknown type", () => {
    const msgs = [
      ErrorMessage.create("unknown", "foo"),
    ];
    expect(() => { ErrorMessage.messagesToString(msgs); }).to.throw(Error, /unknown message type/i);
  });
});
