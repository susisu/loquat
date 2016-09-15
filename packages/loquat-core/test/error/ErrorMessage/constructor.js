/*
 * loquat-core test / error.ErrorMessage constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage } = require("error.js");

describe("constructor(type, msgStr)", () => {
    it("should create a new `ErrorMessage' instance", () => {
        let types = [
            ErrorMessageType.SYSTEM_UNEXPECT,
            ErrorMessageType.UNEXPECT,
            ErrorMessageType.EXPECT,
            ErrorMessageType.MESSAGE
        ];
        for (let type of types) {
            // assert type exists
            expect(type).to.be.a("string");
            let msg = new ErrorMessage(type, "foobar");
            expect(msg).to.be.an.instanceOf(ErrorMessage);
            expect(msg.type).to.equal(type);
            expect(msg.msgStr).to.equal("foobar");
        }
    });
});
