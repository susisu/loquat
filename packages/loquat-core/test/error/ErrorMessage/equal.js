/*
 * loquat-core test / error.ErrorMessage.equal()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const ErrorMessageType = _error.ErrorMessageType;
const ErrorMessage     = _error.ErrorMessage;

describe(".equal(msgA, msgB)", () => {
    it("should return `true' if `msgA' and `msgB' describe the same error message", () => {
        const msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foobar");
        const msgB = new ErrorMessage(ErrorMessageType.UNEXPECT, "foobar");
        expect(ErrorMessage.equal(msgA, msgB)).to.be.true;
    });

    it("should return `false' if `msgA' and `msgB' describe different error messages", () => {
        // different types
        {
            const msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foobar");
            const msgB = new ErrorMessage(ErrorMessageType.EXPECT, "foobar");
            expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
        }
        // different message strings
        {
            const msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foobar");
            const msgB = new ErrorMessage(ErrorMessageType.UNEXPECT, "nyancat");
            expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
        }
        // both
        {
            const msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foobar");
            const msgB = new ErrorMessage(ErrorMessageType.EXPECT, "nyancat");
            expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
        }
    });
});
