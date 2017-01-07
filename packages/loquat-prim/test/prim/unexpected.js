/*
 * loquat-prim test / prim.unexpected()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const assertParser     = _core.assertParser;

const unexpected = _prim.unexpected;

describe(".unexpected(msgStr)", () => {
    it("should return a parser that always yield empty unexpected error with a message `msgStr'", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const parser = unexpected("nyancat");
        assertParser(parser);
        const res = parser.run(initState);
        expect(Result.equal(
            res,
            Result.eerr(
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.UNEXPECT, "nyancat")]
                )
            )
        )).to.be.true;
    });
});
