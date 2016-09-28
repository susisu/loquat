/*
 * loquat-core test / error.ErrorMessage.equal()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _error = require("error.js");
const ErrorMessageType = _error.ErrorMessageType;
const ErrorMessage     = _error.ErrorMessage;

describe(".equal(msgA, msgB)", () => {
    it("should return `true' if `msgA' and `msgB' describe the same error message", () => {
        let msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foobar");
        let msgB = new ErrorMessage(ErrorMessageType.UNEXPECT, "foobar");
        expect(ErrorMessage.equal(msgA, msgB)).to.be.true;
    });

    it("should return `false' if `msgA' and `msgB' describe different error messages", () => {
        // different types
        {
            let msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foobar");
            let msgB = new ErrorMessage(ErrorMessageType.EXPECT, "foobar");
            expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
        }
        // different message strings
        {
            let msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foobar");
            let msgB = new ErrorMessage(ErrorMessageType.UNEXPECT, "nyancat");
            expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
        }
        // both
        {
            let msgA = new ErrorMessage(ErrorMessageType.UNEXPECT, "foobar");
            let msgB = new ErrorMessage(ErrorMessageType.EXPECT, "nyancat");
            expect(ErrorMessage.equal(msgA, msgB)).to.be.false;
        }
    });
});
