/*
 * loquat-core test / error.ErrorMessage.messagesToString()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const ErrorMessageType = _error.ErrorMessageType;
const ErrorMessage     = _error.ErrorMessage;

describe(".messagesToString(msgs)", () => {
    it("should return \"unknown parse error\" if `msgs' is empty", () => {
        expect(ErrorMessage.messagesToString([])).to.equal("unknown parse error");
    });

    it("should pretty-print error messages", () => {
        // only system unexpects
        {
            const msgs = [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysB")
            ];
            const text = "unexpected end of input";
            expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
        }
        {
            const msgs = [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysA"),
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysB"),
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "sysC")
            ];
            const text = "unexpected sysA";
            expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
        }
        // only unexpects
        {
            const msgs = [
                new ErrorMessage(ErrorMessageType.UNEXPECT, "unexpA"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "unexpB"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "unexpC")
            ];
            const text = "unexpected unexpA, unexpB or unexpC";
            expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
        }
        // only expects
        {
            const msgs = [
                new ErrorMessage(ErrorMessageType.EXPECT, "expA"),
                new ErrorMessage(ErrorMessageType.EXPECT, "expB"),
                new ErrorMessage(ErrorMessageType.EXPECT, "expC")
            ];
            const text = "expecting expA, expB or expC";
            expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
        }
        // only messages
        {
            const msgs = [
                new ErrorMessage(ErrorMessageType.MESSAGE, "msgA"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "msgB"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "msgC")
            ];
            const text = "msgA, msgB or msgC";
            expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
        }
        // compound
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
                new ErrorMessage(ErrorMessageType.MESSAGE, "msgC")
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
                new ErrorMessage(ErrorMessageType.MESSAGE, "msgC")
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
                new ErrorMessage(ErrorMessageType.MESSAGE, "msgC")
            ];
            const text = "unexpected unexpA, unexpB or unexpC\n"
                + "expecting expA, expB or expC\n"
                + "msgA, msgB or msgC";
            expect(ErrorMessage.messagesToString(msgs)).to.equal(text);
        }
    });

    it("should throw an `Error' if `msgs' contains any message with unknown type", () => {
        const msgs = [
            new ErrorMessage("unknown", "foo")
        ];
        expect(() => { ErrorMessage.messagesToString(msgs); }).to.throw(Error);
    });
});
