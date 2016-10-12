/*
 * loquat-core test / error.ErrorMessage.messagesEqual()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const ErrorMessageType = _error.ErrorMessageType;
const ErrorMessage     = _error.ErrorMessage;

describe(".messagesEqual(msgsA, msgsB)", () => {
    it("should return `true' if two messages have the same error messages with the same order", () => {
        let msgsA = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let msgsB = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.true;
    });

    it("should return `false' if two messages have different errors or are differently ordered", () => {
        // different messages
        {
            let msgsA = [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
            ];
            let msgsB = [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
                new ErrorMessage(ErrorMessageType.EXPECT, "z"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "w")
            ];
            expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.false;
        }
        // lacks some messages
        {
            let msgsA = [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
            ];
            let msgsB = [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz")
            ];
            expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.false;
        }
        // differently ordered
        {
            let msgsA = [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
            ];
            let msgsB = [
                new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo")
            ];
            expect(ErrorMessage.messagesEqual(msgsA, msgsB)).to.be.false;
        }
    });
});
