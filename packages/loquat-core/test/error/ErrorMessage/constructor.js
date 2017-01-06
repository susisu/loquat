/*
 * loquat-core test / error.ErrorMessage constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const ErrorMessageType = _error.ErrorMessageType;
const ErrorMessage     = _error.ErrorMessage;

describe("constructor(type, msgStr)", () => {
    it("should create a new `ErrorMessage' instance", () => {
        const types = [
            ErrorMessageType.SYSTEM_UNEXPECT,
            ErrorMessageType.UNEXPECT,
            ErrorMessageType.EXPECT,
            ErrorMessageType.MESSAGE
        ];
        for (const type of types) {
            // assert type exists
            expect(type).to.be.a("string");
            const msg = new ErrorMessage(type, "foobar");
            expect(msg).to.be.an.instanceOf(ErrorMessage);
            expect(msg.type).to.equal(type);
            expect(msg.msgStr).to.equal("foobar");
        }
    });
});
